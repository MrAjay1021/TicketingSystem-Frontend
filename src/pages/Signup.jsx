import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Signup.module.css';
import EyeIcon from '../components/Icons/EyeIcon';
import apiService from '../services/api.jsx';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Confirm passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare data for API (excluding confirmPassword)
      const { confirmPassword, ...signupData } = formData;
      
      // Call signup API
      const response = await apiService.signup(signupData);
      
      if (response.error) {
        throw new Error(response.message || 'Registration failed');
      }
      
      // On success, redirect to login page with email in query params
      navigate(`/login?first=true&email=${encodeURIComponent(formData.email)}`);
      
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.password === formData.confirmPassword &&
      agreeToTerms
    );
  };

  return (
    <div className={styles.signInPage}>
      <div className={styles.signInContainer}>
        <div className={styles.formSide}>
          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logo}>
              <img src={process.env.PUBLIC_URL + '/img/logoHubly.svg'} alt="Hubly Logo" />
            </Link>
          </div>
          
          <div className={styles.formContainer}>
            <h1 className={styles.title}>Create an account</h1>
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <form className={styles.signInForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="firstName"
                  className={styles.formInput}
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="lastName"
                  className={styles.formInput}
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  name="email"
                  className={styles.formInput}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={styles.formInput}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                  disabled={isLoading}
                >
                  <EyeIcon isVisible={showPassword} />
                </button>
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className={styles.formInput}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={toggleConfirmPasswordVisibility}
                  tabIndex="-1"
                  disabled={isLoading}
                >
                  <EyeIcon isVisible={showConfirmPassword} />
                </button>
              </div>
              
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  disabled={isLoading}
                />
                <label htmlFor="agreeTerms">
                  By creating an account, I agree to our Terms of use and Privacy Policy
                </label>
              </div>
              
              <button
                type="submit"
                className={styles.loginBtn}
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create an account'}
              </button>
            </form>
            
            <div className={styles.signUpLink}>
              <span>Already have an account?</span>
              <Link to="/login">Sign in instead</Link>
            </div>
            
            <div className={styles.termsText}>
              This site is protected by reCAPTCHA and the{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
              {' '}and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              {' '}apply.
            </div>
          </div>
        </div>
        
        <div
          className={styles.imageSide}
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/img/signUpregis.svg'})` }}
        />
      </div>
    </div>
  );
};

export default Signup; 