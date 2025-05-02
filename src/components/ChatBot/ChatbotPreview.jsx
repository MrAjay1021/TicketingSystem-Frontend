import React, { useState } from 'react';
import styles from './ChatbotPreview.module.css';

const ChatbotPreview = ({ headerColor, backgroundColor, customMessages, welcomeMessage, introForm }) => {
  const [activeScreen, setActiveScreen] = useState('chat'); // Chat or form
  const [messageInput, setMessageInput] = useState('');

  // Toggle between chat and form view
  const toggleScreen = () => {
    setActiveScreen(activeScreen === 'chat' ? 'form' : 'chat');
  };

  return (
    <div className={styles.previewContainer}>
      {/* Chat window */}
      <div className={styles.chatbotInterface}>
        {/* Header bar */}
        <div 
          className={styles.chatHeader} 
          style={{ backgroundColor: headerColor }}
        >
          <div className={styles.profileSection}>
            <div className={styles.avatarContainer}>
              <img 
                src="/img/avatar.svg" 
                alt="Hubly Avatar" 
                className={styles.avatar} 
              />
              <div className={styles.statusIndicator}></div>
            </div>
            <span className={styles.botName}>Hubly</span>
          </div>
        </div>
        
        {/* Chat content area */}
        <div 
          className={styles.chatBody}
          style={{ backgroundColor }}
        >
          {activeScreen === 'chat' ? (
            // Messages view
            <div className={styles.messagesContainer}>
              {/* Bot message bubbles */}
              {customMessages.map((message, index) => (
                <div key={index} className={styles.messageBubble}>
                  <p className={styles.messageText}>{message.text}</p>
                </div>
              ))}
              
              {/* Welcome message */}
              <div className={styles.welcomeContainer}>
                <div className={styles.welcomeAvatar}>
                  <img 
                    src="/img/avatar.svg" 
                    alt="Hubly Avatar" 
                    className={styles.welcomeAvatarImg} 
                  />
                </div>
                <div className={styles.welcomeBubble}>
                  <p className={styles.welcomeText}>{welcomeMessage}</p>
                </div>
              </div>
            </div>
          ) : (
            // Contact form 
            <div className={styles.formContainer}>
              <h3 className={styles.formTitle}>Introduction Yourself</h3>
              
              {introForm.fields.map((field, index) => (
                <div key={index} className={styles.formField}>
                  <label className={styles.fieldLabel}>{field.label}</label>
                  <input 
                    type={field.label.toLowerCase().includes('email') ? 'email' : 'text'} 
                    placeholder={field.placeholder}
                    className={styles.fieldInput}
                    readOnly
                  />
                </div>
              ))}
              
              <button 
                className={styles.submitButton}
                style={{ backgroundColor: headerColor }}
                onClick={toggleScreen}
              >
                {introForm.submitText}
              </button>
            </div>
          )}
        </div>
        
        {/* Message input box */}
        <div className={styles.chatInputContainer}>
          <input 
            type="text" 
            placeholder="Write a message" 
            className={styles.chatInput}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button className={styles.sendButton}>
            <i className={styles.sendIcon}>→</i>
          </button>
        </div>
      </div>
      
      {/* Toggle button for demo */}
      <button 
        className={styles.toggleButton}
        onClick={toggleScreen}
      >
        Toggle to {activeScreen === 'chat' ? 'Form' : 'Chat'} View
      </button>
    </div>
  );
};

export default ChatbotPreview; 