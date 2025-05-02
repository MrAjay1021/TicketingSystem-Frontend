import React from 'react';
import styles from './MessageCustomizer.module.css';

const MessageCustomizer = ({ messages, onMessageUpdate }) => {
  const handleInputChange = (id, value) => {
    onMessageUpdate(id, value);
  };

  return (
    <div className={styles.messageCustomizer}>
      {messages.map((message) => (
        <div key={message.id} className={styles.messageInputContainer}>
          <input
            type="text"
            className={styles.messageInput}
            value={message.text}
            onChange={(e) => handleInputChange(message.id, e.target.value)}
            placeholder="Enter custom message"
          />
          <button className={styles.editButton}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.9376 1.25C11.0868 1.10104 11.2644 0.981926 11.4601 0.899666C11.6559 0.817406 11.8661 0.773376 12.0782 0.770356C12.2903 0.767336 12.5017 0.805388 12.6998 0.882423C12.898 0.959458 13.0788 1.07353 13.232 1.2184C13.3852 1.36327 13.5076 1.5375 13.5919 1.73235C13.6762 1.9272 13.7208 2.13875 13.7233 2.35317C13.7257 2.56759 13.6859 2.78029 13.6068 2.97745C13.5276 3.1746 13.4096 3.35243 13.2606 3.5L12.4532 4.31667L10.1251 2L10.9376 1.25ZM8.96261 3.175L1.87511 10.325V12.6667H4.22511L11.3126 5.525L8.97511 3.16667L8.96261 3.175Z" fill="#606060"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MessageCustomizer; 