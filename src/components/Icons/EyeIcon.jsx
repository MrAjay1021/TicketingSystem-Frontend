import React from 'react';

// Eye icon component - updated implementation
const EyeIcon = ({ isVisible }) => {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {isVisible ? (
        // Eye open - simplified and cleaner design
        <>
          <path 
            d="M12 5C7.453 5 3.67 7.909 2 12C3.67 16.091 7.453 19 12 19C16.547 19 20.33 16.091 22 12C20.33 7.909 16.547 5 12 5Z" 
            stroke="#676B5F" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
            stroke="#676B5F" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </>
      ) : (
        // Eye closed - simplified design
        <>
          <path 
            d="M12 5C7.453 5 3.67 7.909 2 12C3.67 16.091 7.453 19 12 19C16.547 19 20.33 16.091 22 12C20.33 7.909 16.547 5 12 5Z" 
            stroke="#676B5F" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
            stroke="#676B5F" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M4 4L20 20" 
            stroke="#676B5F" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
};

export default EyeIcon; 