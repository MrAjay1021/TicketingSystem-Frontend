import React, { useState } from 'react';
import styles from './ColorSelector.module.css';

const ColorSelector = ({ selectedColor, onColorChange, colors, showHexInput, hexValue }) => {
  const [inputHexValue, setInputHexValue] = useState(hexValue || selectedColor);

  // Handle direct hex value input
  const handleHexInputChange = (e) => {
    const value = e.target.value;
    setInputHexValue(value);
    
    // Validate hex color (simple validation)
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      onColorChange(value);
    }
  };

  // Handle hex input blur (to validate on leave)
  const handleHexInputBlur = () => {
    // Ensure input is a valid hex color
    if (!inputHexValue.match(/^#[0-9A-Fa-f]{6}$/)) {
      // Reset to previous valid value
      setInputHexValue(selectedColor);
    }
  };

  return (
    <div className={styles.colorSelector}>
      <div className={styles.colorOptions}>
        {colors.map((color, index) => (
          <button
            key={index}
            className={`${styles.colorOption} ${color === selectedColor ? styles.selected : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => {
              onColorChange(color);
              setInputHexValue(color);
            }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      
      {showHexInput && (
        <div className={styles.hexInputContainer}>
          <input
            type="text"
            className={styles.hexInput}
            value={inputHexValue}
            onChange={handleHexInputChange}
            onBlur={handleHexInputBlur}
            placeholder="#RRGGBB"
          />
        </div>
      )}
      
      <div className={styles.colorPreview}>
        <div 
          className={styles.previewBox}
          style={{ backgroundColor: selectedColor }}
        ></div>
      </div>
    </div>
  );
};

export default ColorSelector; 