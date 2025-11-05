package repository

import (
	"database/sql"
	"time"

	"github.com/mrtokyo33/shibuya-shell/pkg/model"
)

type ChatRepository struct {
	db *sql.DB
}

func NewChatRepository(db *sql.DB) *ChatRepository {
	return &ChatRepository{db: db}
}

func (r *ChatRepository) CreateConversation(title string) (int64, error) {
	result, err := r.db.Exec(
		"INSERT INTO conversations (title, created_at) VALUES (?, ?)",
		title,
		time.Now(),
	)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func (r *ChatRepository) CreateMessage(msg *model.Message) error {
	_, err := r.db.Exec(
		"INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
		msg.ID,
		msg.ConversationID,
		msg.Role,
		msg.Content,
		msg.CreatedAt,
	)
	return err
}

func (r *ChatRepository) GetMessagesByConversationID(convID int64) ([]*model.Message, error) {
	rows, err := r.db.Query(
		"SELECT id, conversation_id, role, content, created_at FROM messages WHERE conversation_id = ? ORDER BY id ASC",
		convID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []*model.Message
	for rows.Next() {
		var msg model.Message
		var createdAt time.Time
		if err := rows.Scan(&msg.ID, &msg.ConversationID, &msg.Role, &msg.Content, &createdAt); err != nil {
			return nil, err
		}
		msg.CreatedAt = createdAt
		messages = append(messages, &msg)
	}
	return messages, rows.Err()
}

func (r *ChatRepository) GetConversations() ([]*model.Conversation, error) {
	rows, err := r.db.Query(
		"SELECT id, title, created_at FROM conversations ORDER BY created_at DESC",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var conversations []*model.Conversation
	for rows.Next() {
		var conv model.Conversation
		var createdAt time.Time
		if err := rows.Scan(&conv.ID, &conv.Title, &createdAt); err != nil {
			return nil, err
		}
		conv.CreatedAt = createdAt
		conversations = append(conversations, &conv)
	}
	return conversations, rows.Err()
}

func (r *ChatRepository) UpdateConversationTitle(convID int64, newTitle string) error {
	_, err := r.db.Exec(
		"UPDATE conversations SET title = ? WHERE id = ?",
		newTitle,
		convID,
	)
	return err
}

func (r *ChatRepository) DeleteConversation(convID int64) error {
	_, err := r.db.Exec("DELETE FROM conversations WHERE id = ?", convID)
	return err
}