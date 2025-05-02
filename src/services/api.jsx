/**
 * API service for all backend communication
 * Contains methods for fetching data for different sections of the application
 */
import { heroData, partnersData, featuresData, pricingData, testimonialsData } from '../data/placeholderData';

// Default API URL with fallback
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production'
    ? 'https://ticketingsystem-backend.onrender.com/api'
    : 'http://localhost:5000/api');

/**
 * Handles API errors and provides consistent error format
 * @param {Error} error - The error object
 * @returns {Object} Formatted error object
 */
const handleError = (error) => {
  console.error('API Error:', error);
  return {
    error: true,
    message: error.message || 'An unexpected error occurred',
    status: error.status || 500,
  };
};

/**
 * Base fetch function with error handling
 * @param {string} endpoint - API endpoint to fetch from
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data or error
 */
const fetchFromApi = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}/${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // Add JWT if logged in
      ...(localStorage.getItem('token') && {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };

    // Prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));
    
    // Handle request errors
    if (!response.ok) {
      let errorMessage = data.message || `Server error: ${response.status} ${response.statusText}`;
      
      // Make MongoDB validation errors more user-friendly
      if (errorMessage.includes('validation failed')) {
        const fieldErrors = [];
        
        if (errorMessage.includes('lastName:')) {
          fieldErrors.push('Last name is required');
        }
        if (errorMessage.includes('firstName:')) {
          fieldErrors.push('First name is required');
        }
        if (errorMessage.includes('email:')) {
          fieldErrors.push('Valid email is required');
        }
        
        if (fieldErrors.length > 0) {
          errorMessage = `Validation error: ${fieldErrors.join(', ')}`;
        }
      }
      
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    // User-friendly error messages
    if (error.name === 'AbortError') {
      return handleError({
        message: 'Request timed out. Please check your connection and try again.',
        status: 408,
      });
    }
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return handleError({
        message: 'Unable to connect to the server. Please check if the server is running.',
        status: 503,
      });
    }
    
    return handleError(error);
  }
};

// API service object with methods for different data needs
const apiService = {
  // User authentication
  login: async (credentials) => {
    return fetchFromApi('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // First login with username setup
  firstLogin: async (data) => {
    return fetchFromApi('auth/first-login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Create new user account
  signup: async (userData) => {
    return fetchFromApi('auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get logged-in user data
  getCurrentUser: async () => {
    return fetchFromApi('auth/me');
  },

  // Alias for getCurrentUser
  getMe: async () => {
    return fetchFromApi('auth/me');
  },

  // Start a new chat
  initializeChat: async (userInfo) => {
    return fetchFromApi('chat/sessions', {
      method: 'POST',
      body: JSON.stringify(userInfo),
    });
  },

  // Send a message to the chatbot
  sendChatBotMessage: async (messageData) => {
    return fetchFromApi('bot/message', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Get chat history, optionally from a specific time
  getChatHistory: async (sessionId, since = null) => {
    let endpoint = `chat/${sessionId}/messages`;
    if (since) {
      // Encode timestamp for URL
      endpoint += `?since=${encodeURIComponent(since)}`;
    }
    return fetchFromApi(endpoint);
  },

  // Add message to existing chat
  sendChatMessage: async (sessionId, message) => {
    return fetchFromApi(`chat/${sessionId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Get hero section content
  getHeroData: async () => {
    try {
      const data = await fetchFromApi('content/hero');
      return data.error ? heroData : data;
    } catch (error) {
      console.warn('Using placeholder hero data due to API error');
      return heroData;
    }
  },

  // Get partners section content
  getPartnersData: async () => {
    try {
      const data = await fetchFromApi('content/partners');
      return data.error ? partnersData : data;
    } catch (error) {
      console.warn('Using placeholder partners data due to API error');
      return partnersData;
    }
  },

  // Get features section content
  getFeaturesData: async () => {
    try {
      const data = await fetchFromApi('content/features');
      return data.error ? featuresData : data;
    } catch (error) {
      console.warn('Using placeholder features data due to API error');
      return featuresData;
    }
  },

  // Get pricing section content
  getPricingData: async () => {
    try {
      const data = await fetchFromApi('content/pricing');
      return data.error ? pricingData : data;
    } catch (error) {
      console.warn('Using placeholder pricing data due to API error');
      return pricingData;
    }
  },

  // Get testimonials section content
  getTestimonialsData: async () => {
    try {
      const data = await fetchFromApi('content/testimonials');
      return data.error ? testimonialsData : data;
    } catch (error) {
      console.warn('Using placeholder testimonials data due to API error');
      return testimonialsData;
    }
  },

  // Save contact form submission
  submitContactForm: async (formData) => {
    return fetchFromApi('contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  // Get team member list
  getTeamMembers: async () => {
    return fetchFromApi('team/members');
  },

  // Invite new team member
  inviteTeamMember: async (memberData) => {
    return fetchFromApi('team/invite', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  // Remove team member
  deleteTeamMember: async (memberId) => {
    return fetchFromApi(`team/members/${memberId}`, {
      method: 'DELETE',
    });
  },

  // Accept team invitation
  acceptTeamInvitation: async (inviteToken) => {
    return fetchFromApi('team/accept-invitation', {
      method: 'POST',
      body: JSON.stringify({ token: inviteToken }),
    });
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    return fetchFromApi('auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Update user password
  changePassword: async (passwordData) => {
    return fetchFromApi('auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  // Create new chat session
  startChatSession: async (userInfo) => {
    return fetchFromApi('chat/sessions', {
      method: 'POST',
      body: JSON.stringify(userInfo),
    });
  },
  
  // Get messages for a chat
  getChatMessages: async (sessionId) => {
    return fetchFromApi(`chat/${sessionId}/messages`);
  },
  
  // Get support tickets
  getTickets: async (status = '') => {
    const endpoint = status ? `tickets?status=${status}` : 'tickets';
    return fetchFromApi(endpoint);
  },
  
  // Get detailed ticket info
  getTicket: async (ticketId) => {
    return fetchFromApi(`tickets/${ticketId}`);
  },
  
  // Reply to a ticket
  replyToTicket: async (ticketId, message) => {
    return fetchFromApi(`tickets/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
  
  // Get new ticket messages
  getNewMessages: async (ticketId, since) => {
    return fetchFromApi(`tickets/${ticketId}/messages?since=${encodeURIComponent(since)}`);
  },
  
  // Assign ticket to another agent
  reassignTicket: async (ticketId, userId) => {
    return fetchFromApi(`tickets/${ticketId}/reassign`, {
      method: 'PUT',
      body: JSON.stringify({ userId }),
    });
  },
  
  // Change ticket status
  updateTicketStatus: async (ticketId, status) => {
    return fetchFromApi(`tickets/${ticketId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  
  // Get chatbot settings
  getChatbotConfig: async () => {
    console.log('[API] Requesting chatbot config');
    const response = await fetchFromApi('bot/config');
    console.log('[API] Received chatbot config:', response);
    return response;
  },
  
  // Update chatbot settings
  updateChatbotConfig: async (config) => {
    console.log('[API] Sending chatbot config update:', config);
    const response = await fetchFromApi('bot/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
    console.log('[API] Update response:', response);
    return response;
  },
  
  // Get team info
  getTeam: async () => {
    return fetchFromApi('teams');
  },
  
  // Add team member
  addTeamMember: async (teamId, memberData) => {
    return fetchFromApi(`teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },
  
  // Update team member role
  updateTeamMember: async (teamId, userId, role) => {
    return fetchFromApi(`teams/${teamId}/members/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
  
  // Remove team member
  removeTeamMember: async (teamId, userId) => {
    return fetchFromApi(`teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    });
  },
  
  // Get missed chat stats
  getMissedChatsAnalytics: async () => {
    return fetchFromApi('analytics/missed-chats');
  },
  
  // Get response time stats
  getResponseTimeAnalytics: async () => {
    return fetchFromApi('analytics/response-time');
  },
  
  // Get tickets by status stats
  getTicketsByStatusAnalytics: async () => {
    return fetchFromApi('analytics/tickets-by-status');
  },
  
  // Get total chats stats
  getTotalChatsAnalytics: async (start = '', end = '') => {
    let endpoint = 'analytics/total-chats';
    
    if (start || end) {
      endpoint += '?';
      if (start) endpoint += `start=${start}`;
      if (start && end) endpoint += '&';
      if (end) endpoint += `end=${end}`;
    }
    
    return fetchFromApi(endpoint);
  },
  
  // Get key analytics data
  getAnalyticsOverview: async () => {
    return fetchFromApi('analytics/overview');
  },
  
  // Get admin's chat list
  getAdminChats: async () => {
    return fetchFromApi('chat/admin');
  },
  
  // Get agent's assigned chats
  getAssignedChats: async () => {
    return fetchFromApi('chat/assigned');
  },
};

export default apiService;