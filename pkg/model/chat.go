package model

import "time"

type Conversation struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"createdAt"`
}

type Message struct {
	ID             int64     `json:"id"`
	ConversationID int64     `json:"conversationId"`
	Role           string    `json:"role"`
	Content        string    `json:"content"`
	CreatedAt      time.Time `json:"createdAt"`
}

type ChatResponseDTO struct {
	Message  Message  `json:"message"`
	Keywords []string `json:"keywords"`
}