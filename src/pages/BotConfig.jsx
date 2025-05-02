import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import styles from './BotConfig.module.css';
import ChatbotPreview from '../components/ChatBot/ChatbotPreview';
import ColorSelector from '../components/ChatBot/ColorSelector';
import MessageCustomizer from '../components/ChatBot/MessageCustomizer';
import IntroductionForm from '../components/ChatBot/IntroductionForm';
import WelcomeMessage from '../components/ChatBot/WelcomeMessage';
import MissedChatTimer from '../components/ChatBot/MissedChatTimer';
import apiService from '../services/api.jsx';
import { TOAST_MESSAGES } from '../constants/toastMessages.jsx';

const BotConfig = () => {
  // State for all chatbot configuration data
  const [botConfig, setBotConfig] = useState({
    headerColor: '#33475B',
    backgroundColor: '#EEEEEE',
    customMessages: [
      { id: 1, text: 'How can I help you?' },
      { id: 2, text: 'Ask me anything!' }
    ],
    welcomeMessage: '👋 Want to chat about Hubly? I\'m an chatbot here to help you find your way.',
    introForm: {
      fields: [
        { id: 1, label: 'Your name', placeholder: 'Your name', required: true },
        { id: 2, label: 'Your Phone', placeholder: '+1 (000) 000-0000', required: true },
        { id: 3, label: 'Your Email', placeholder: 'example@gmail.com', required: true }
      ],
      submitText: 'Thank You!'
    },
    missedChatTimer: {
      hours: 12,
      minutes: 10,
      seconds: 0
    },
    isLoading: true,
    error: null
  });

  // Simulate fetching from API
  useEffect(() => {
    const fetchBotConfig = async () => {
      try {
        console.log('[CONFIG] Fetching configuration...');
        const res = await apiService.getChatbotConfig();
        if (res.error) throw new Error(res.message);
        const cfg = res.data;

        console.log('[CONFIG] Loaded configuration:', cfg);
        
        // Map backend format to frontend format
        const mappedFields = cfg.introductionForm && cfg.introductionForm.fields 
          ? cfg.introductionForm.fields.map((field, index) => ({
              id: index + 1,
              name: field.name,
              label: field.label || field.name,
              placeholder: field.label || field.name,
              required: field.required !== undefined ? field.required : true,
            }))
          : [
              { id: 1, name: 'name', label: 'Your name', placeholder: 'Your name', required: true },
              { id: 2, name: 'phone', label: 'Your Phone', placeholder: '+1 (000) 000-0000', required: true },
              { id: 3, name: 'email', label: 'Your Email', placeholder: 'example@gmail.com', required: true }
            ];
            
        const submitText = cfg.introductionForm?.submitButtonText || 'Thank You!';
        
        console.log('[CONFIG] Mapped form fields:', mappedFields);
        console.log('[CONFIG] Submit text:', submitText);
        
        setBotConfig({
          headerColor: cfg.headerColor || '#33475B',
          backgroundColor: cfg.backgroundColor || '#EEEEEE',
          customMessages: cfg.promptMessages && cfg.promptMessages.length > 0 
            ? cfg.promptMessages.map((text, id) => ({ id: id + 1, text })) 
            : [
                { id: 1, text: 'How can I help you?' },
                { id: 2, text: 'Ask me anything!' }
              ],
          welcomeMessage: cfg.welcomeMessage || '👋 Want to chat about Hubly? I\'m a chatbot here to help you find your way.',
          introForm: {
            fields: mappedFields,
            submitText: submitText
          },
          missedChatTimer: cfg.missedChatTimer || {
            hours: 0,
            minutes: 10,
            seconds: 0
          },
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('[CONFIG] Error fetching bot configuration:', error);
        setBotConfig(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load bot configuration. Please try again later.'
        }));
      }
    };
    fetchBotConfig();
  }, []);

  // Update header color
  const handleHeaderColorChange = (color) => {
    setBotConfig({
      ...botConfig,
      headerColor: color
    });
  };

  // Update background color
  const handleBackgroundColorChange = (color) => {
    setBotConfig({
      ...botConfig,
      backgroundColor: color
    });
  };

  // Update custom messages
  const handleMessageUpdate = (id, text) => {
    const updatedMessages = botConfig.customMessages.map(msg => 
      msg.id === id ? { ...msg, text } : msg
    );
    
    setBotConfig({
      ...botConfig,
      customMessages: updatedMessages
    });
  };

  // Update welcome message
  const handleWelcomeMessageChange = (text) => {
    setBotConfig({
      ...botConfig,
      welcomeMessage: text
    });
  };

  // Update introduction form fields
  const handleIntroFormUpdate = (formData) => {
    setBotConfig({
      ...botConfig,
      introForm: formData
    });
  };

  // Update missed chat timer
  const handleTimerUpdate = (timer) => {
    setBotConfig({
      ...botConfig,
      missedChatTimer: timer
    });
  };

  // Save configuration to backend
  const handleSaveConfig = async () => {
    try {
      console.log('[CONFIG] Preparing to save with current state:', botConfig);
      
      // Map frontend form fields to backend format
      const mappedFields = botConfig.introForm.fields.map(field => ({
        name: field.name || field.label?.toLowerCase().split(' ')[0] || 'field',
        required: field.required !== undefined ? field.required : true,
        label: field.label || field.placeholder
      }));
      
      console.log('[CONFIG] Mapped fields for saving:', mappedFields);
      
      // Build payload for backend
      const payload = {
        welcomeMessage: botConfig.welcomeMessage,
        headerColor: botConfig.headerColor,
        backgroundColor: botConfig.backgroundColor,
        missedChatTimer: botConfig.missedChatTimer,
        promptMessages: botConfig.customMessages.map(msg => msg.text),
        introductionForm: {
          enabled: true,
          fields: mappedFields,
          submitButtonText: botConfig.introForm.submitText || 'Thank You!'
        }
      };
      
      console.log('[CONFIG] Sending config payload:', payload);
      
      const response = await apiService.updateChatbotConfig(payload);
      console.log('[CONFIG] Save response:', response);
      
      window.dispatchEvent(
        new CustomEvent('showToast', {
          detail: { type: 'success', message: TOAST_MESSAGES.SAVE_BOT_CONFIG_SUCCESS }
        })
      );
      
      // Refresh the config to ensure we have the latest data
      const updatedConfig = await apiService.getChatbotConfig();
      console.log('[CONFIG] Updated config from server:', updatedConfig);
      
      // Notify other components to update
      window.dispatchEvent(new Event('botConfigUpdated'));
    } catch (error) {
      console.error('[CONFIG] Error saving bot configuration:', error);
      window.dispatchEvent(
        new CustomEvent('showToast', {
          detail: { type: 'error', message: TOAST_MESSAGES.SAVE_BOT_CONFIG_ERROR }
        })
      );
    }
  };

  // Loading state
  if (botConfig.isLoading) {
    return (
      <Layout>
        <div className={styles.botConfig}>
          <h1 className={styles.pageTitle}>Chat Bot Configuration</h1>
          <div className={styles.loading}>Loading configuration...</div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (botConfig.error) {
    return (
      <Layout>
        <div className={styles.botConfig}>
          <h1 className={styles.pageTitle}>Chat Bot Configuration</h1>
          <div className={styles.error}>{botConfig.error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.botConfig}>
        <h1 className={styles.pageTitle}>Chat Bot</h1>
        
        <div className={styles.configContainer}>
          {/* Left side - Chatbot Preview */}
          <div className={styles.previewSection}>
            <ChatbotPreview 
              headerColor={botConfig.headerColor}
              backgroundColor={botConfig.backgroundColor}
              customMessages={botConfig.customMessages}
              welcomeMessage={botConfig.welcomeMessage}
              introForm={botConfig.introForm}
            />
          </div>
          
          {/* Right side - Configuration Options */}
          <div className={styles.optionsSection}>
            {/* Header Color */}
            <div className={styles.configCard}>
              <h2 className={styles.cardTitle}>Header Color</h2>
              <ColorSelector 
                selectedColor={botConfig.headerColor}
                onColorChange={handleHeaderColorChange}
                colors={['#FFFFFF', '#000000', '#33475B']}
                showHexInput={true}
                hexValue={botConfig.headerColor}
              />
            </div>
            
            {/* Background Color */}
            <div className={styles.configCard}>
              <h2 className={styles.cardTitle}>Custom Background Color</h2>
              <ColorSelector 
                selectedColor={botConfig.backgroundColor}
                onColorChange={handleBackgroundColorChange}
                colors={['#FFFFFF', '#000000', '#FAFBFC']}
                showHexInput={true}
                hexValue={botConfig.backgroundColor}
              />
            </div>
            
            {/* Customize Messages */}
            <div className={styles.configCard}>
              <h2 className={styles.cardTitle}>Customize Message</h2>
              <MessageCustomizer 
                messages={botConfig.customMessages}
                onMessageUpdate={handleMessageUpdate}
              />
            </div>
            
            {/* Introduction Form */}
            <div className={styles.configCard}>
              <h2 className={styles.cardTitle}>Introduction Form</h2>
              <IntroductionForm 
                formData={botConfig.introForm}
                onFormUpdate={handleIntroFormUpdate}
              />
            </div>
            
            {/* Welcome Message */}
            <div className={styles.configCard}>
              <h2 className={styles.cardTitle}>Welcome Message</h2>
              <WelcomeMessage 
                message={botConfig.welcomeMessage}
                onMessageChange={handleWelcomeMessageChange}
              />
            </div>
            
            {/* Missed Chat Timer */}
            <div className={styles.configCard}>
              <h2 className={styles.cardTitle}>Missed chat timer</h2>
              <MissedChatTimer 
                timer={botConfig.missedChatTimer}
                onTimerUpdate={handleTimerUpdate}
              />
            </div>
            
            {/* Save Button */}
            <div className={styles.saveButtonContainer}>
              <button 
                className={styles.saveButton}
                onClick={handleSaveConfig}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BotConfig; 