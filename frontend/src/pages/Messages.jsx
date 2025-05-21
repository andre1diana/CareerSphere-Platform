import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/messages.css';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Get the user ID regardless of whether it's userId or id
  const getUserId = () => {
    return user?.userId || user?.id;
  };

  // Funcție pentru a încărca mesajele unei conversații - definim această funcție înainte
  const fetchMessages = useCallback(async (otherUserId) => {
    const userId = getUserId();
    if (!userId) return;
    
    try {
      const response = await axios.get(
        `http://localhost:8080/api/messages/conversation/${userId}/${otherUserId}`,
        { withCredentials: true }
      );
      setMessages(response.data);
      setNotifications(prev => prev.filter(notif => notif.conversationId !== otherUserId));

    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    }
  }, []);

  // Funcție pentru a crea/selecta conversația
  const handleNewConversation = useCallback((recipientId, recipientName, recipientRole) => {
    if (!recipientId || !recipientName) return;
    
    // Verifică dacă conversația există deja
    const existingConversation = conversations.find(
      conv => conv.id === parseInt(recipientId)
    );
    
    if (existingConversation) {
      // Dacă există, doar o selectăm
      setSelectedConversation(existingConversation);
      fetchMessages(parseInt(recipientId));
    } else {
      // Altfel, creăm o conversație nouă
      const newConversation = {
        id: parseInt(recipientId),
        name: recipientName,
        role: recipientRole,
        lastMessage: "Start a conversation",
        timestamp: new Date().toLocaleTimeString(),
      };
      
      // Adăugăm conversația în lista de conversații
      setConversations(prev => [...prev, newConversation]);
      setSelectedConversation(newConversation);
      fetchMessages(parseInt(recipientId));
    }
    
    // Deschide chat-ul
    setIsOpen(true);
  }, [conversations, fetchMessages]);

  // Ascultă pentru evenimentul custom
  useEffect(() => {
    const handleChatEvent = (event) => {
      const { recipientId, recipientName, recipientRole } = event.detail;
      handleNewConversation(recipientId, recipientName, recipientRole);
    };
    
    document.addEventListener('open-chat', handleChatEvent);
    
    return () => {
      document.removeEventListener('open-chat', handleChatEvent);
    };
  }, [handleNewConversation]);

  useEffect(() => {
    if (!user || user.role === 'guest') {
      navigate('/login');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError("User ID not found");
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/messages/user/${userId}`,
          { withCredentials: true }
        );

        const conversationMap = new Map();
        const newNotifications = [];

        // Adaugă conversația cu adminul implicit
        conversationMap.set(1, {
          id: 1,
          name: "Admin",
          lastMessage: "Salut! Cum te pot ajuta?",
          timestamp: new Date().toLocaleTimeString(),
        });

        response.data.forEach((message) => {
          const otherUserId =
            message.senderId.id === userId
              ? message.receiverId.id
              : message.senderId.id;

          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              id: otherUserId,
              name:
                message.senderId.id === userId
                  ? message.receiverId.name
                  : message.senderId.name,
              lastMessage: message.message,
              timestamp: new Date(message.timestamp).toLocaleTimeString(),
            });
          }

          if (!message.read && message.receiverId.id === userId) {
            newNotifications.push({
              conversationId: otherUserId,
              message: message.message,
            });
          }
        });

        // Convert to array
        const conversationsArray = Array.from(conversationMap.values());

        // Check if we should open a new conversation from location state
        if (location.state?.openChat) {
          const { recipientId, recipientName, recipientRole } = location.state;
          handleNewConversation(recipientId, recipientName, recipientRole);
          
          // Eliminăm starea pentru a evita deschiderea repetată
          window.history.replaceState({}, document.title);
        }

        setNotifications(newNotifications);
        setConversations(conversationsArray);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, navigate, handleNewConversation]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await axios.post(
        'http://localhost:8080/api/messages/send',
        {
          senderId: userId,
          receiverId: selectedConversation.id,
          message: newMessage.trim()
        },
        { withCredentials: true }
      );

      setMessages([...messages, response.data]);
      setNewMessage('');
      
      // Update this conversation's last message
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              lastMessage: newMessage.trim(),
              timestamp: new Date().toLocaleTimeString()
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="messages-container">
      <button 
        className="toggle-chat-btn" 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0077b6',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1001,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        💬 {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
      </button>

      <div className={`messages-widget ${isOpen ? 'open' : 'hidden'}`}>
        <div className="chat-sidebar">
          <h5>Conversații</h5>
          {conversations.length === 0 ? (
            <p className="no-conversations">Nu există conversații</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation ${conv.id === selectedConversation?.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedConversation(conv);
                  fetchMessages(conv.id);
                }}
              >
                <div className="conversation-header">
                  <strong>{conv.name}</strong>
                  <span className="timestamp">{conv.timestamp}</span>
                </div>
                <small className="text-muted">{conv.lastMessage}</small>
              </div>
            ))
          )}
        </div>

        <div className="chat-content">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <h6>{selectedConversation.name} {selectedConversation.company ? `- ${selectedConversation.company}` : ''}</h6>
                <button className="close-chat" onClick={() => setIsOpen(false)}>×</button>
              </div>

              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>Nu există mesaje în această conversație</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`message ${msg.senderId.id === getUserId() ? 'user' : 'employer'}`}
                    >
                      <div className="message-text">{msg.message}</div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Scrie un mesaj..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Trimite</button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <p>Selectează o conversație pentru a începe mesajele</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
