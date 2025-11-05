package service

import (
	"context"
	"log"
	"time"

	"github.com/mrtokyo33/shibuya-shell/pkg/model"
	"github.com/mrtokyo33/shibuya-shell/pkg/repository"
	"github.com/mrtokyo33/shibuya-shell/pkg/utils"
)

type ChatService struct {
	repo      *repository.ChatRepository
	geminiSvc *GeminiService
}

func NewChatService(repo *repository.ChatRepository, geminiSvc *GeminiService) *ChatService {
	return &ChatService{
		repo:      repo,
		geminiSvc: geminiSvc,
	}
}

func (s *ChatService) GeminiSvc() *GeminiService {
	return s.geminiSvc
}

func (s *ChatService) StartNewConversation(title string) (*model.Conversation, error) {
	log.Printf("INFO: Creating new conversation with title: %s", title)
	id, err := s.repo.CreateConversation(title)
	if err != nil {
		log.Printf("ERROR: Failed to create conversation: %v", err)
		return nil, err
	}

	log.Printf("INFO: Conversation created successfully with ID: %d", id)
	return &model.Conversation{
		ID:        id,
		Title:     title,
		CreatedAt: time.Now(),
	}, nil
}

func (s *ChatService) GetAllConversations() ([]*model.Conversation, error) {
	return s.repo.GetConversations()
}

func (s *ChatService) ProcessUserMessage(ctx context.Context, convID int64, userContent string) (*model.ChatResponseDTO, error) {
	log.Printf("INFO: Processing user message for conversation ID: %d", convID)

	userID, err := utils.GenerateSnowflakeID()
	if err != nil {
		log.Printf("ERROR: Failed to generate user message ID: %v", err)
		return nil, err
	}

	userMessage := &model.Message{
		ID:             userID,
		ConversationID: convID,
		Role:           "user",
		Content:        userContent,
		CreatedAt:      time.Now(),
	}

	if err := s.repo.CreateMessage(userMessage); err != nil {
		log.Printf("ERROR: Failed to save user message: %v", err)
		return nil, err
	}
	log.Printf("INFO: User message saved successfully")

	history, err := s.repo.GetMessagesByConversationID(convID)
	if err != nil {
		log.Printf("ERROR: Failed to retrieve conversation history: %v", err)
		return nil, err
	}

	log.Printf("INFO: Generating AI response...")
	aiResponseText, keywords, err := s.geminiSvc.GenerateResponse(ctx, history)
	if err != nil {
		log.Printf("ERROR: Failed to generate AI response: %v", err)
		return nil, err
	}

	if aiResponseText == "" {
		log.Printf("WARNING: AI returned empty response")
	}

	modelID, err := utils.GenerateSnowflakeID()
	if err != nil {
		log.Printf("ERROR: Failed to generate model message ID: %v", err)
		return nil, err
	}

	modelMessage := &model.Message{
		ID:             modelID,
		ConversationID: convID,
		Role:           "model",
		Content:        aiResponseText,
		CreatedAt:      time.Now(),
	}

	if err := s.repo.CreateMessage(modelMessage); err != nil {
		log.Printf("ERROR: Failed to save AI response: %v", err)
		return nil, err
	}

	log.Printf("INFO: AI response saved successfully with %d keywords", len(keywords))

	responseDTO := &model.ChatResponseDTO{
		Message:  *modelMessage,
		Keywords: keywords,
	}

	return responseDTO, nil
}

func (s *ChatService) GetConversationHistory(convID int64) ([]*model.Message, error) {
	return s.repo.GetMessagesByConversationID(convID)
}

func (s *ChatService) UpdateConversationTitle(convID int64, newTitle string) error {
	log.Printf("INFO: Updating conversation %d title to: %s", convID, newTitle)
	err := s.repo.UpdateConversationTitle(convID, newTitle)
	if err != nil {
		log.Printf("ERROR: Failed to update conversation title: %v", err)
		return err
	}
	log.Printf("INFO: Conversation title updated successfully")
	return nil
}

func (s *ChatService) DeleteConversation(convID int64) error {
	log.Printf("INFO: Deleting conversation ID: %d", convID)
	err := s.repo.DeleteConversation(convID)
	if err != nil {
		log.Printf("ERROR: Failed to delete conversation: %v", err)
		return err
	}
	log.Printf("INFO: Conversation deleted successfully")
	return nil
}