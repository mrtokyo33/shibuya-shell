import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateNewConversation, GetAllConversations, SendMessage, GetConversationHistory, UpdateConversationTitle, DeleteConversation } from '../../wailsjs/go/main/App';
import { model } from '../../wailsjs/go/models';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import './AIAssistant.css';

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<model.Conversation[]>([]);
  const [currentConvID, setCurrentConvID] = useState<number | null>(null);
  const [messages, setMessages] = useState<model.Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewConvDialog, setShowNewConvDialog] = useState(false);
  const [newConvTitle, setNewConvTitle] = useState('');
  const [editingConvID, setEditingConvID] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [pendingDeleteID, setPendingDeleteID] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showNewConvDialog || pendingDeleteID) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showNewConvDialog, pendingDeleteID]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const convs = await GetAllConversations();
      setConversations(convs || []);
      if (!currentConvID && convs && convs.length > 0) {
        selectConversation(convs[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const createNewConversation = async () => {
    if (!newConvTitle.trim()) return;

    try {
      const newConv = await CreateNewConversation(newConvTitle);
      setConversations([newConv, ...conversations]);
      setCurrentConvID(newConv.id);
      setMessages([]);
      setShowNewConvDialog(false);
      setNewConvTitle('');
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const selectConversation = async (convID: number) => {
    try {
      setCurrentConvID(convID);
      const history = await GetConversationHistory(convID);
      setMessages(history || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const requestDeleteConversation = (convID: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDeleteID(convID);
  };

  const confirmDelete = async () => {
    if (pendingDeleteID === null) return;

    try {
      await DeleteConversation(pendingDeleteID);
      setConversations(conversations.filter(c => c.id !== pendingDeleteID));
      if (currentConvID === pendingDeleteID) {
        setCurrentConvID(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    } finally {
      setPendingDeleteID(null);
    }
  };

  const startEditingTitle = (convID: number, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvID(convID);
    setEditingTitle(currentTitle);
  };

  const saveTitle = async (convID: number) => {
    if (!editingTitle.trim()) return;

    try {
      await UpdateConversationTitle(convID, editingTitle);
      setConversations(conversations.map(c => {
        if (c.id === convID) {
          const updated = new model.Conversation(c);
          updated.title = editingTitle;
          return updated;
        }
        return c;
      }));
      setEditingConvID(null);
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentConvID || isLoading) return;

    const userContent = inputMessage;
    const tempUserMessage = new model.Message({
      id: Date.now(),
      conversationId: currentConvID,
      role: 'user',
      content: userContent,
      createdAt: new Date().toISOString(),
    });

    setMessages(prev => [...prev, tempUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      await SendMessage(currentConvID, userContent);
      const history = await GetConversationHistory(currentConvID);
      setMessages(history || []);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-assistant-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      <div className="sidebar">
        <button className="new-conversation-button" onClick={() => setShowNewConvDialog(true)}>
          + New Conversation
        </button>

        <div className="conversations-list">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`conversation-item ${currentConvID === conv.id ? 'active' : ''}`}
              onClick={() => selectConversation(conv.id)}
            >
              {editingConvID === conv.id ? (
                <input
                  type="text"
                  className="conversation-title-input"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => saveTitle(conv.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveTitle(conv.id)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <>
                  <span className="conversation-title">{conv.title}</span>
                  <button className="icon-button" onClick={(e) => startEditingTitle(conv.id, conv.title, e)}>
                    {FiEdit2({}) as ReactElement}
                  </button>
                  <button className="icon-button" onClick={(e) => requestDeleteConversation(conv.id, e)}>
                    {FiTrash2({}) as ReactElement}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {currentConvID ? (
          <>
            <div className="messages-container">
              {messages.map(msg => (
                <div key={msg.id} className="message">
                  <div className={`message-avatar ${msg.role}`}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-content">
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message">
                  <div className="message-avatar model">🤖</div>
                  <div className="message-content">Thinking...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <textarea
                className="message-textarea"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                className="send-button"
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            Select a conversation or create a new one to start
          </div>
        )}
      </div>

      {showNewConvDialog && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNewConvDialog(false);
              setNewConvTitle('');
            }
          }}
        >
          <div className="modal-content">
            <h2 className="modal-title">New Conversation</h2>
            <input
              type="text"
              className="modal-input"
              value={newConvTitle}
              onChange={(e) => setNewConvTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createNewConversation()}
              placeholder="Enter conversation name..."
              autoFocus
            />
            <div className="modal-buttons">
              <button
                className="modal-button secondary"
                onClick={() => {
                  setShowNewConvDialog(false);
                  setNewConvTitle('');
                }}
              >
                Cancel
              </button>
              <button
                className="modal-button primary"
                onClick={createNewConversation}
                disabled={!newConvTitle.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteID !== null && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPendingDeleteID(null);
            }
          }}
        >
          <div className="modal-content">
            <h2 className="modal-title">Delete Conversation?</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px', fontSize: '14px' }}>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="modal-buttons">
              <button className="modal-button secondary" onClick={() => setPendingDeleteID(null)}>
                Cancel
              </button>
              <button className="modal-button danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
