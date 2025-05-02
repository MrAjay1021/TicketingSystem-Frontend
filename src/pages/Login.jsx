import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Signup.module.css';
import EyeIcon from '../components/Icons/EyeIcon';
import apiService from '../services/api.jsx';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin, firstLogin: contextFirstLogin } = useAuth();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const isFirstLogin = queryParams.get('first') === 'true';
  const email = queryParams.get('email');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: email || '' // Set from query param if available
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
    
    // Safety check: if marked as first login but no email, redirect to signup
    if (isFirstLogin && !email) {
      navigate('/signup');
    }
  }, [location, isFirstLogin, email, navigate]);
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      let result;
      if (isFirstLogin) {
        // First-login: set username and login via context
        result = await contextFirstLogin({
          email: formData.email,
          password: formData.password,
          username: formData.username
        });
      } else {
        // Normal login via context
        const loginPayload = { username: formData.username, password: formData.password };
        if (formData.username.includes('@')) loginPayload.email = formData.username;
        result = await contextLogin(loginPayload);
        if (result.needsUsername) {
          navigate(`/login?first=true&email=${encodeURIComponent(formData.username)}`);
          return;
        }
      }
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      // On success, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormValid = () => {
    return (
      formData.username.trim() !== '' &&
      formData.password.trim() !== ''
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
            <h1 className={styles.title}>
              {isFirstLogin ? 'Choose a username' : 'Sign in'}
            </h1>
            
            {successMessage && (
              <div className={styles.successMessage}>
                {successMessage}
              </div>
            )}
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <form className={styles.signInForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="username"
                  className={styles.formInput}
                  placeholder="Username"
                  value={formData.username}
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
              
              {/* Hidden email field for first login */}
              {isFirstLogin && (
                <input
                  type="hidden"
                  name="email"
                  value={formData.email}
                />
              )}
              
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              
              <button
                type="submit"
                className={styles.loginBtn}
                disabled={!isFormValid() || isLoading}
              >
                {isLoading 
                  ? 'Please wait...' 
                  : isFirstLogin 
                    ? 'Set username & continue' 
                    : 'Sign in'
                }
              </button>
            </form>
            
            <div className={styles.signUpLink}>
              <span>Don't have an account?</span>
              <Link to="/signup">Sign up</Link>
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
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/img/signInlogin.svg'})` }}
        />
      </div>
    </div>
  );
};

export default Login; 