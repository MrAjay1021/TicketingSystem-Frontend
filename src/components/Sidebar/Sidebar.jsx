import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';
import '../../styles/layout.css';

const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 400 || window.innerHeight <= 600);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '/img/dashboard.svg', 
      path: '/dashboard' 
    },
    { 
      id: 'contactCenter', 
      name: 'Contact Center', 
      icon: '/img/contactCenter.svg', 
      path: '/tickets' 
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: '/img/Analytics.svg', 
      path: '/analytics' 
    },
    { 
      id: 'chatbot', 
      name: 'Chatbot', 
      icon: '/img/chatbot.svg', 
      path: '/bot-config' 
    },
    { 
      id: 'team', 
      name: 'Team', 
      icon: '/img/team.svg', 
      path: '/teams' 
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: '/img/setting.svg', 
      path: '/settings' 
    }
  ];

  const handleMouseEnter = (id) => {
    if (!isMobile) {
      setActiveItem(id);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveItem(null);
    }
  };

  // Function to handle menu item click
  const handleMenuItemClick = (e, item) => {
    // Check for chatbot config specifically for team members
    if (item.id === 'chatbot' && currentUser && currentUser.role === 'team_member') {
      e.preventDefault(); // Prevent default Link navigation
      // Dispatch custom event to show toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: {
          type: 'error',
          message: "You are not authorized to access this page"
        }
      }));
      console.log("Team member tried to access chatbot config"); // Optional: for debugging
    } else {
      // Default behavior for admins or other links
      if (isMobile) {
        setActiveItem(item.id === activeItem ? null : item.id);
      }
      // Allow navigation to proceed
    }
  };

  return (
    <div className={`${styles.sidebar} sidebar`}>
      <div className={styles.logoContainer}>
        <Link to="/dashboard">
          <img src="/img/logo.svg" alt="Logo" className={styles.logo} />
        </Link>
      </div>
      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li 
                key={item.id} 
                className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleMenuItemClick(e, item)}
              >
                <Link to={item.path} className={styles.menuLink}>
                  <div className={styles.iconContainer}>
                    <img src={item.icon} alt={item.name} className={styles.icon} />
                  </div>
                  <span className={`${styles.menuText} ${activeItem === item.id ? styles.visible : ''}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Separate Profile component */}
      <ProfileMenu />
    </div>
  );
};

export default Sidebar; 