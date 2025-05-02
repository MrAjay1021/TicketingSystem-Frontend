import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only trigger the animation if we have a message
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Delay the onClose to allow the fade-out animation to complete
        setTimeout(() => {
          if (onClose) onClose();
        }, 300); // Match the transition duration in CSS
      }, duration);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toastBody} ${styles[type]} ${visible ? styles.visible : styles.hidden}`}>
        <div className={styles.contentWrapper}>
          <span className={styles.message}>{message}</span>
          <button 
            className={styles.closeButton} 
            onClick={() => { 
              setVisible(false); 
              // Delay the onClose to allow the fade-out animation to complete
              setTimeout(() => {
                if(onClose) onClose();
              }, 300);
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast; 