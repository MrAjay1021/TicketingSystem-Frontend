import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout/Layout';
import apiService from '../services/api.jsx';
import { useAuth } from '../context/AuthContext';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  
  // Setup profile form
  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors } } = useForm();
  
  // Setup password form
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors }, watch } = useForm();
  
  // Get password value for comparison
  const password = watch('newPassword', '');
  
  // Load user data when component mounts
  useEffect(() => {
    if (currentUser) {
      resetProfile({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser, resetProfile]);
  
  // Handle profile update
  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const response = await apiService.updateUserProfile(data);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to update profile');
      }
      
      setSuccessMessage('Profile updated successfully');
      
      // Reset form with new values
      resetProfile({
        firstName: response.user?.firstName || data.firstName,
        lastName: response.user?.lastName || data.lastName,
        email: response.user?.email || data.email
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password change
  const onPasswordSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const response = await apiService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      
      if (response.error) {
        throw new Error(response.message || 'Failed to change password');
      }
      
      setSuccessMessage('Password changed successfully. You will be logged out.');
      resetPassword();
      // Log out user immediately
      logout();
      
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className={styles.settingsPage}>
        <h1 className={styles.pageTitle}>Settings</h1>
        
        <div className={styles.contentContainer}>
          <div className={styles.tabsContainer}>
            <div 
              className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Edit Profile
            </div>
            <div className={styles.tabIndicator}>
              <div 
                className={styles.indicator} 
                style={{ 
                  width: activeTab === 'profile' ? '133.31px' : '0'
                }}
              ></div>
            </div>
          </div>
          
          <div className={styles.formContainer}>
            {/* Success and error messages */}
            {successMessage && (
              <div className={styles.successMessage}>
                <p>{successMessage}</p>
              </div>
            )}
            
            {errorMessage && (
              <div className={styles.errorMessage}>
                <p>{errorMessage}</p>
                <button onClick={() => setErrorMessage('')} className={styles.dismissButton}>
                  Dismiss
                </button>
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className={styles.profileEditSection}>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      className={styles.formInput}
                      {...registerProfile('firstName', { required: 'First name is required' })}
                    />
                    {profileErrors.firstName && <p className={styles.errorText}>{profileErrors.firstName.message}</p>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      className={styles.formInput}
                      {...registerProfile('lastName', { required: 'Last name is required' })}
                    />
                    {profileErrors.lastName && <p className={styles.errorText}>{profileErrors.lastName.message}</p>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <div className={styles.inputWithIcon}>
                      <input
                        id="email"
                        type="email"
                        className={styles.formInput}
                        {...registerProfile('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                      <img src="/img/info.svg" alt="Info" className={styles.infoIcon} />
                    </div>
                    {profileErrors.email && <p className={styles.errorText}>{profileErrors.email.message}</p>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="currentPassword">Password</label>
                    <div className={styles.inputWithIcon}>
                      <input
                        id="currentPassword"
                        type="password"
                        className={styles.formInput}
                        {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      />
                      <img
                        src="/img/info.svg"
                        alt="Info"
                        className={styles.infoIcon}
                        onMouseEnter={() => setShowPasswordTooltip(true)}
                        onMouseLeave={() => setShowPasswordTooltip(false)}
                      />
                      {showPasswordTooltip && (
                        <div className={styles.tooltip}>
                          Please fill the password fields below to change your password
                        </div>
                      )}
                    </div>
                    {passwordErrors.currentPassword && <p className={styles.errorText}>{passwordErrors.currentPassword.message}</p>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <div className={styles.inputWithIcon}>
                      <input
                        id="newPassword"
                        type="password"
                        className={styles.formInput}
                        {...registerPassword('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          }
                        })}
                      />
                      <img src="/img/info.svg" alt="Info" className={styles.infoIcon} />
                    </div>
                    {passwordErrors.newPassword && <p className={styles.errorText}>{passwordErrors.newPassword.message}</p>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className={styles.inputWithIcon}>
                      <input
                        id="confirmPassword"
                        type="password"
                        className={styles.formInput}
                        {...registerPassword('confirmPassword', { 
                          validate: value => value === password || 'Passwords do not match'
                        })}
                      />
                      <img src="/img/info.svg" alt="Info" className={styles.infoIcon} />
                      <div className={styles.passwordTooltip}>
                        User will be logged out immediately
                      </div>
                    </div>
                    {passwordErrors.confirmPassword && <p className={styles.errorText}>{passwordErrors.confirmPassword.message}</p>}
                  </div>
                  
                  <div className={styles.submitButtonContainer}>
                    <button 
                      type="submit" 
                      className={styles.saveButton}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage; 