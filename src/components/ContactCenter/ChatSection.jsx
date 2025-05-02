import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatSection.module.css';
import apiService from '../../services/api.jsx';

const ChatSection = ({ selectedChat, onResolve, isResolved }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [localIsResolved, setLocalIsResolved] = useState(false);
  const messageInputRef = useRef(null);
  
  // Update local state when prop changes
  useEffect(() => {
    if (isResolved !== undefined) {
      setLocalIsResolved(isResolved);
    }
  }, [isResolved]);

  // When a new chat is selected, load its messages and initialize lastTimestamp
  useEffect(() => {
    if (selectedChat) {
      const mapped = (selectedChat.messages || []).map(msg => ({
        id: msg._id || Date.now(),
        text: msg.content,
        sender: msg.sender?.role === 'customer' ? 'user' : 'agent',
        senderName: msg.sender?.firstName ? `${msg.sender.firstName} ${msg.sender.lastName}` : 'Agent',
        timestamp: new Date(msg.timestamp),
        isSystem: msg.isSystem || false,
        isMissedChatNotification: msg.isMissedChatNotification || false
      }));
      setChatMessages(mapped);
      // Set lastTimestamp to the newest message timestamp or now
      const newest = mapped.length > 0 ? mapped[mapped.length - 1].timestamp.toISOString() : new Date().toISOString();
      setLastTimestamp(newest);
      if (isResolved === undefined) {
        setLocalIsResolved(false);
      }
    }
  }, [selectedChat, isResolved]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!selectedChat || !lastTimestamp) return;
    const interval = setInterval(async () => {
      try {
        const res = await apiService.getNewMessages(selectedChat.ticket._id, lastTimestamp);
        if (res.success && Array.isArray(res.data) && res.data.length) {
          // Map incoming messages
          const newMsgs = res.data.map(msg => ({
            id: msg._id,
            text: msg.content,
            sender: msg.sender.role === 'customer' ? 'user' : 'agent',
            senderName: msg.sender.firstName ? `${msg.sender.firstName} ${msg.sender.lastName}` : 'Agent',
            timestamp: new Date(msg.timestamp),
            isSystem: msg.isSystem || false,
            isMissedChatNotification: msg.isMissedChatNotification || false
          }));
          setChatMessages(prev => {
            // Filter out messages already present
            const prevIds = new Set(prev.map(m => m.id));
            const uniqueMsgs = newMsgs.filter(m => !prevIds.has(m.id));
            if (uniqueMsgs.length === 0) return prev;
            // Update lastTimestamp based on new messages
            setLastTimestamp(uniqueMsgs[uniqueMsgs.length - 1].timestamp.toISOString());
            return [...prev, ...uniqueMsgs];
          });
        }
      } catch (err) {
        console.error('Error polling new messages:', err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedChat, lastTimestamp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const text = message;
    // Optimistically update UI
    const tempId = Date.now();
    const optimisticMessage = {
      id: tempId,
      text,
      sender: 'agent',
      senderName: 'Agent',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, optimisticMessage]);
    setMessage('');
    try {
      // Persist to backend via ticket reply API
      const res = await apiService.replyToTicket(selectedChat.ticket._id, text);
      if (!res.success) throw new Error(res.message || 'Reply failed');
      const backendMsg = res.data.message;
      // Map backend message to UI format
      const mapped = {
        id: backendMsg._id,
        text: backendMsg.content,
        sender: backendMsg.sender.role === 'customer' ? 'user' : 'agent',
        senderName: backendMsg.sender.firstName ? `${backendMsg.sender.firstName} ${backendMsg.sender.lastName}` : 'Agent',
        timestamp: new Date(backendMsg.timestamp),
        isSystem: backendMsg.isSystem || false,
        isMissedChatNotification: backendMsg.isMissedChatNotification || false
      };
      // Replace optimistic message with persisted one
      setChatMessages(prev => prev.map(msg => msg.id === tempId ? mapped : msg));
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message
      setChatMessages(prev => prev.filter(msg => msg.id !== tempId));
      alert('Failed to send message. Please try again.');
    }
  };

  const handleResolve = () => {
    if (window.confirm('Chat will be closed. Are you sure?')) {
      setLocalIsResolved(true);
      if (onResolve) onResolve(selectedChat);
    }
  };

  if (!selectedChat) {
    return (
      <div className={styles.chatSection}>
        <div className={styles.noSelection}>
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatSection}>
      <div className={styles.chatHeader}>
        <div className={styles.chatInfo}>
          <h3>Ticket# {selectedChat.ticket.ticketNumber}</h3>
        </div>
        <div className={styles.headerActions}>
          {!localIsResolved && (
            <button className={styles.resolveButton} onClick={handleResolve}>
              Resolve
            </button>
          )}
          <div className={styles.homeIcon}>
            <a href="/dashboard">
              <img src="/img/signout.svg" alt="Home" />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.chatMessages}>
        {localIsResolved ? (
          <div className={styles.resolvedMessage}>
            <p>The chat has been resolved</p>
          </div>
        ) : (
          <>
            {/* Logic to render messages with date separators */}
            {(chatMessages || []).reduce((acc, msg, index, arr) => {
              const currentDate = msg.timestamp.toLocaleDateString();
              const previousDate = index > 0 ? arr[index - 1].timestamp.toLocaleDateString() : null;

              // Add date separator if date changed or it's the first message
              if (index === 0 || currentDate !== previousDate) {
                acc.push(
                  <div key={`date-${currentDate}`} className={styles.dateMarker}>
                    <span>{msg.timestamp.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                );
              }

              // Add the message bubble
              acc.push(
                <div 
                  key={msg.id} 
                  className={`${styles.messageContainer} ${
                    msg.sender === 'user' ? styles.userMessage : 
                    msg.isSystem ? styles.systemMessage : styles.agentMessage
                  }`}
                >
                  {msg.sender === 'user' && !msg.isSystem && (
                    <div className={styles.messageInfo}>
                      <span className={styles.messageSender}>{selectedChat.name}</span>
                    </div>
                  )}
                  <div className={styles.messageRow}>
                    {msg.sender === 'user' && !msg.isSystem && (
                      <div className={styles.avatar}>
                        <span>{selectedChat.name?.charAt(0) || ''}</span>
                      </div>
                    )}
                    <div className={`${styles.message} ${msg.isMissedChatNotification ? styles.missedChatMessage : ''}`}>
                      <p className={msg.isMissedChatNotification ? styles.missedChatText : ''}>{msg.text}</p>
                      <span className={styles.messageTimestamp}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {msg.sender !== 'user' && !msg.isSystem && (
                      <div className={styles.avatar}>
                        <span>{msg.senderName?.charAt(0) || ''}</span>
                      </div>
                    )}
                  </div>
                  {msg.sender !== 'user' && !msg.isSystem && (
                    <div className={styles.messageInfo}>
                      <span className={styles.messageSender}>{msg.senderName}</span>
                    </div>
                  )}
                </div>
              );
              return acc;
            }, [])}
          </>
        )}
      </div>

      {!localIsResolved && (
        <div className={styles.chatInputContainer}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="type here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={messageInputRef}
            />
            <button type="submit" className={styles.sendButton}>
              <img src="/img/enter.svg" alt="Send" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatSection; 