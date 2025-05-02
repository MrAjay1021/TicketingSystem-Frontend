import React, { useState } from 'react';
import styles from './ContactCenterPanel.module.css';

const ContactCenterPanel = ({ chats = [], selectedChatId, onChatSelect }) => {
  // When a chat is clicked, notify parent
  const handleChatSelect = (chat) => {
    if (onChatSelect) onChatSelect(chat);
  };

  return (
    <div className={styles.contactCenterPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Contact Center</h2>
      </div>
      
      <div className={styles.chatsLabel}>Chats</div>
      
      <div className={styles.chatList}>
        {chats.map(chat => (
          <div
            key={chat.id}
            className={
              `${styles.chatItem}` +
              (selectedChatId === chat.id ? ` ${styles.selected}` : '') +
              (chat.missed ? ` ${styles.missed}` : '')
            }
            onClick={() => handleChatSelect(chat)}
          >
            <div className={styles.chatInfo}>
              <div className={styles.chatName}>{chat.name}</div>
              <div className={styles.chatMessage}>{chat.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactCenterPanel; 