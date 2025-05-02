/**
 * Application configuration
 * Contains API endpoints and other configuration settings
 */

// App configuration settings

// API endpoint
export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://ticketingsystem-backend.onrender.com/api'
    : 'http://localhost:5000/api');

const config = {
  // API settings
  api: {
    baseUrl: API_BASE_URL,
    timeout: 15000, // 15 seconds
  },
  
  // Auth storage keys
  auth: {
    tokenKey: 'token',
    refreshKey: 'refreshToken',
  },
  
  // Chatbot defaults
  chatbot: {
    initialMessage: 'Hello! How can I help you today?',
    missedChatTimeout: 30, // seconds
  }
};

export default config; 