package main

import (
	"context"
	"fmt"

	"github.com/mrtokyo33/shibuya-shell/pkg/model"
	"github.com/mrtokyo33/shibuya-shell/pkg/service"
)

type App struct {
	ctx          context.Context
	WindowWidth  int
	WindowHeight int
	ChatService  *service.ChatService
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	fmt.Printf("INFO: App started with size: %d x %d\n", a.WindowWidth, a.WindowHeight)
}

func (a *App) shutdown(ctx context.Context) {
	fmt.Println("INFO: App is shutting down")
	if a.ChatService != nil && a.ChatService.GeminiSvc() != nil {
		a.ChatService.GeminiSvc().Close()
	}
}

func (a *App) GetWindowSettings() map[string]int {
	return map[string]int{
		"width":  a.WindowWidth,
		"height": a.WindowHeight,
	}
}

func (a *App) SetWindowSettings(width int, height int) {
	a.WindowWidth = width
	a.WindowHeight = height
}

func (a *App) CreateNewConversation(title string) (*model.Conversation, error) {
	return a.ChatService.StartNewConversation(title)
}

func (a *App) GetAllConversations() ([]*model.Conversation, error) {
	return a.ChatService.GetAllConversations()
}

func (a *App) SendMessage(convID int64, message string) (*model.ChatResponseDTO, error) {
	return a.ChatService.ProcessUserMessage(a.ctx, convID, message)
}

func (a *App) GetConversationHistory(convID int64) ([]*model.Message, error) {
	return a.ChatService.GetConversationHistory(convID)
}

func (a *App) UpdateConversationTitle(convID int64, newTitle string) error {
	return a.ChatService.UpdateConversationTitle(convID, newTitle)
}

func (a *App) DeleteConversation(convID int64) error {
	return a.ChatService.DeleteConversation(convID)
}