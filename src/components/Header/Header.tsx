import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src="/img/logo.svg" alt="Ticket System Logo" />
          </Link>
        </div>
        <div className="navigation">
          <div className="navButtons">
            <button 
              className="loginButton" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="signupButton" 
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 