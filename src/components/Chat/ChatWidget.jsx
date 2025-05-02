import React, { useState, useEffect, useRef, useCallback } from 'react';
import apiService from '../../services/api.jsx';
import { TOAST_MESSAGES } from '../../constants/toastMessages.jsx';
import styles from './ChatWidget.module.css';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils.jsx';

const ChatWidget = () => {
  // Chatbot settings
  const [chatbotConfig, setChatbotConfig] = useState({
    headerColor: '#33475B',
    backgroundColor: '#EEEEEE',
    customMessages: [
      { id: 1, text: 'How can I help you?' },
      { id: 2, text: 'Ask me anything!' }
    ],
    welcomeMessage: '👋 Want to chat about Hubly? I\'m a chatbot here to help you find your way.',
    introForm: {
      fields: [
        { name: 'name', label: 'Your name', placeholder: 'Your name', required: true },
        { name: 'phone', label: 'Your Phone', placeholder: '+1 (000) 000-0000', required: true },
        { name: 'email', label: 'Your Email', placeholder: 'example@gmail.com', required: true }
      ],
      submitButtonText: 'Thank You!',
      submitTextLoading: 'Please wait...'
    },
    missedChatTimer: { hours: 12, minutes: 10, seconds: 0 }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  
  // Chat state
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to latest messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Load past chat messages
  const loadChatHistory = useCallback(async () => {
    if (!chatId) return;
    setIsLoading(true);
    try {
      const response = await apiService.getChatHistory(chatId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to load chat history');
      }
      const serverMsgs = response.data.messages || [];
      
      // Hide system messages from users
      const visibleMsgs = serverMsgs.filter(
        msg => !(msg.isSystem && (
          msg.content.startsWith('Ticket reassigned') ||
          msg.content.startsWith('Ticket status changed') ||
          msg.content.startsWith('Auto-replying to missed chat') ||
          msg.content === 'Replying to missed chat'
        ))
      );
      
      const mappedMsgs = visibleMsgs.map(msg => ({
        id: msg._id,
        text: msg.content,
        senderType: msg.isSystem ? 'system'
          : (msg.sender?.role === 'customer' ? 'customer' : 'agent'),
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(mappedMsgs);
      
      // Update timestamp tracker
      if (mappedMsgs.length > 0) {
        setLastMessageTimestamp(mappedMsgs[mappedMsgs.length - 1].timestamp.toISOString());
      }
    } catch (err) {
      setError('Failed to load messages. Please try again.');
      console.error('Error loading chat history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId && !showForm) {
      loadChatHistory();
    }
  }, [chatId, showForm, loadChatHistory]);
  
  // Get chatbot appearance settings
  const fetchBotConfig = async () => {
    try {
      const res = await apiService.getChatbotConfig();
      if (!res.success) return console.error('Failed to load bot config:', res.message);
      const cfg = res.data;
      setChatbotConfig({
        headerColor: cfg.headerColor,
        backgroundColor: cfg.backgroundColor,
        customMessages: (cfg.promptMessages || []).map((text, idx) => ({ id: idx + 1, text })),
        welcomeMessage: cfg.welcomeMessage || '👋 Want to chat about Hubly? I\'m a chatbot here to help you find your way.',
        introForm: {
          fields: (cfg.introductionForm.fields || []).map((f, idx) => ({
            name: f.name,
            label: f.label,
            placeholder: f.label,
            required: f.required
          })),
          submitButtonText: cfg.introductionForm.submitButtonText || 'Thank You!',
          submitTextLoading: cfg.introductionForm.submitTextLoading || 'Please wait...'
        },
        missedChatTimer: cfg.missedChatTimer || { hours: 12, minutes: 10, seconds: 0 }
      });
    } catch (err) {
      console.error('Error fetching chatbot config:', err);
    }
  };

  // Load settings when widget opens
  useEffect(() => {
    fetchBotConfig();
    window.addEventListener('botConfigUpdated', fetchBotConfig);
    return () => window.removeEventListener('botConfigUpdated', fetchBotConfig);
  }, []);
  
  // Check for new messages periodically
  const fetchNewMessages = useCallback(async () => {
    if (!chatId || showForm || !lastMessageTimestamp) return;
    try {
      const response = await apiService.getChatHistory(chatId, lastMessageTimestamp);
      if (!response.success) {
        console.error('Polling error:', response.message);
        return;
      }
      const newServerMsgs = response.data.messages || []; 
      if (newServerMsgs.length > 0) {
        // Hide system messages
        const visibleNewMsgs = newServerMsgs.filter(
          msg => !(msg.isSystem && (
            msg.content.startsWith('Ticket reassigned') ||
            msg.content.startsWith('Ticket status changed') ||
            msg.content.startsWith('Auto-replying to missed chat') ||
            msg.content === 'Replying to missed chat'
          ))
        );
        
        const newMappedMsgs = visibleNewMsgs.map(msg => ({
          id: msg._id,
          text: msg.content,
          senderType: msg.isSystem ? 'system'
            : (msg.sender?.role === 'customer' ? 'customer' : 'agent'),
          timestamp: new Date(msg.timestamp)
        }));
        
        // Avoid duplicate messages
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const trulyNewMsgs = newMappedMsgs.filter(m => !existingIds.has(m.id));
          
          if (trulyNewMsgs.length === 0) {
            return prev;
          }
          
          // Add new messages to the list
          const updatedMessages = [...prev, ...trulyNewMsgs];
          setLastMessageTimestamp(updatedMessages[updatedMessages.length - 1].timestamp.toISOString());
          return updatedMessages;
        });
      }
    } catch (err) {
      console.error('Error fetching new messages:', err);
    }
  }, [chatId, showForm, lastMessageTimestamp]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!chatId || showForm || !lastMessageTimestamp) return;
    const interval = setInterval(fetchNewMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId, showForm, lastMessageTimestamp, fetchNewMessages]);

  const handleToggleChat = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    // Refresh when opening
    if (opening) {
      fetchBotConfig();
      // Show form for new users
      if (!chatId) setShowForm(true);
      // Reload messages for returning users
      if (chatId && !showForm) loadChatHistory();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const chatData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      const res = await apiService.initializeChat(chatData);
      if (!res.success) throw new Error(res.message || 'Failed to initialize chat');
      showSuccessToast(TOAST_MESSAGES.CHAT_SESSION_START_SUCCESS);
      const { session } = res.data;
      setChatId(session.sessionId);
      window.dispatchEvent(new Event('refreshTickets'));
      
      // Show first message
      const initialText = chatbotConfig.customMessages[0]?.text
        || chatbotConfig.welcomeMessage;
      const initialMappedMsgs = [
        { id: Date.now(), text: initialText, senderType: 'agent', timestamp: new Date() }
      ];
      setMessages(initialMappedMsgs);
      if (initialMappedMsgs.length > 0) {
        setLastMessageTimestamp(initialMappedMsgs[initialMappedMsgs.length - 1].timestamp.toISOString());
      }
      setShowForm(false);
    } catch (err) {
      setError('Failed to start chat. Please try again.');
      showErrorToast(TOAST_MESSAGES.CHAT_SESSION_START_ERROR);
      console.error('Chat initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMessageChange = (e) => {
    setCurrentMessage(e.target.value);
    
    // Reset error state
    if (error) setError(null);
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!currentMessage.trim() || !chatId) return;
    
    const messageToSend = currentMessage;
    setCurrentMessage(''); // Clear input right away
    setIsLoading(true);
    
    try {
      // Send message to backend
      const response = await apiService.sendChatMessage(chatId, messageToSend);
      if (!response.success) {
        throw new Error(response.message || 'Failed to send message');
      }
      
      // Get any new messages
      fetchNewMessages();
      
      // Show bot response if included
      if (response.botResponse) {
        const botMsg = {
          id: response.botResponse.id || Date.now() + 1,
          text: response.botResponse.text,
          senderType: 'agent',
          timestamp: new Date(response.botResponse.timestamp) || new Date()
        };
        // Add bot message if not already shown
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          if (!existingIds.has(botMsg.id)) {
            const updatedMessages = [...prev, botMsg];
            setLastMessageTimestamp(updatedMessages[updatedMessages.length - 1].timestamp.toISOString());
            return updatedMessages;
          }
          return prev;
        });
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      showErrorToast(TOAST_MESSAGES.CHAT_MESSAGE_SEND_ERROR);
      console.error('Message sending error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className={styles.chatWidgetContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader} style={{ backgroundColor: chatbotConfig.headerColor }}>
            <div className={styles.chatIconStatus}>
              <div className={styles.chatIcon}>
                <img
                  src={process.env.PUBLIC_URL + '/img/chatbotlogoImg.svg'}
                  alt="Chatbot logo"
                />
              </div>
              <div className={styles.chatStatus}></div>
            </div>
            <div className={styles.chatTitle}>Hubly</div>
          </div>
          
          <div className={styles.chatMessages} style={{ backgroundColor: chatbotConfig.backgroundColor }}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            {isLoading && showForm && <div className={styles.loader}>Loading...</div>}
            
            {showForm ? (
              <>
                {/* Welcome message */}
                <div className={`${styles.messageBubble} ${styles.botMessage}`}>
                  <p>{chatbotConfig.welcomeMessage}</p>
                </div>
                {/* User info form */}
                <div className={styles.introductionForm}>
                  <form onSubmit={handleSubmit}>
                    {chatbotConfig.introForm.fields.map(field => (
                      <div key={field.name} className={styles.formGroup}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <input
                          type={field.name === 'email' ? 'email' : field.name === 'phone' ? 'tel' : 'text'}
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || field.label}
                          required={field.required}
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                      {isLoading
                        ? chatbotConfig.introForm.submitTextLoading
                        : chatbotConfig.introForm.submitButtonText}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Messages container */
              <div className={styles.messagesList}>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`${styles.messageBubble} ${
                      message.senderType === 'customer' ? styles.userMessage : styles.botMessage
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles.messageBubble} ${styles.botMessage}`}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className={styles.chatComposer}>
            <div className={styles.chatInput}>
              <input 
                type="text" 
                placeholder="Write a message" 
                value={currentMessage}
                onChange={handleMessageChange}
                onKeyPress={handleKeyPress}
                disabled={showForm || isLoading}
              />
            </div>
            <button 
              className={styles.sendButton} 
              onClick={handleSendMessage}
              disabled={showForm || isLoading || !currentMessage.trim()}
            >
              <img src={process.env.PUBLIC_URL + '/img/enter.svg'} alt="Send" />
            </button>
          </div>
        </div>
      )}
      
      <button
        className={styles.chatButton}
        onClick={handleToggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <img
            src={process.env.PUBLIC_URL + '/img/chatBotActionIconButton_landingPage.svg'}
            alt="Close chat"
          />
        ) : (
          <img
            src={process.env.PUBLIC_URL + '/img/chatbotIconButton_landingPage.svg'}
            alt="Open chat"
          />
        )}
      </button>
    </div>
  );
};

export default ChatWidget; 