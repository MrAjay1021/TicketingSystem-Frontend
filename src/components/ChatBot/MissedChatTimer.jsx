import React, { useState } from 'react';
import styles from './MissedChatTimer.module.css';

const MissedChatTimer = ({ timer, onTimerUpdate }) => {
  const [localTimer, setLocalTimer] = useState(timer);
  
  // Handle time input change
  const handleTimeChange = (field, value) => {
    // Ensure value is a number and within valid range
    let numValue = parseInt(value, 10);
    if (isNaN(numValue)) numValue = 0;
    
    // Apply range limits based on field
    switch (field) {
      case 'hours':
        numValue = Math.min(Math.max(numValue, 0), 23);
        break;
      case 'minutes':
      case 'seconds':
        numValue = Math.min(Math.max(numValue, 0), 59);
        break;
      default:
        break;
    }
    
    const updatedTimer = { ...localTimer, [field]: numValue };
    setLocalTimer(updatedTimer);
    onTimerUpdate(updatedTimer);
  };
  
  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };
  
  return (
    <div className={styles.missedChatTimer}>
      <div className={styles.timerContainer}>
        <div className={styles.timerInputs}>
          <div className={styles.timeField}>
            <input
              type="number"
              className={styles.timeInput}
              value={formatNumber(localTimer.hours)}
              onChange={(e) => handleTimeChange('hours', e.target.value)}
              min="0"
              max="23"
              aria-label="Hours"
            />
            <span className={styles.timeColon}>:</span>
          </div>
          
          <div className={styles.timeField}>
            <input
              type="number"
              className={styles.timeInput}
              value={formatNumber(localTimer.minutes)}
              onChange={(e) => handleTimeChange('minutes', e.target.value)}
              min="0"
              max="59"
              aria-label="Minutes"
            />
            <span className={styles.timeColon}>:</span>
          </div>
          
          <div className={styles.timeField}>
            <input
              type="number"
              className={styles.timeInput}
              value={formatNumber(localTimer.seconds)}
              onChange={(e) => handleTimeChange('seconds', e.target.value)}
              min="0"
              max="59"
              aria-label="Seconds"
            />
          </div>
        </div>
      </div>
      
      <div className={styles.timerDescription}>
        <p>Set the time after which a chat will be considered missed if not answered by an agent.</p>
      </div>
    </div>
  );
};

export default MissedChatTimer; 