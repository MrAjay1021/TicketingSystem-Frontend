import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProfileMenu.module.css';

const ProfileMenu = () => {
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleSignOut = () => {
    // Implementation of signout logic
    // Clear any auth tokens from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
    console.log('Signed out');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.profileSection} ref={menuRef}>
      <Link 
        to="/profile" 
        className={styles.profileLink}
        onMouseEnter={() => setShowProfileTooltip(true)}
        onMouseLeave={() => setShowProfileTooltip(false)}
        onClick={(e) => { e.preventDefault(); setShowMenu(prev => !prev); }}
      >
        <img src="/img/profileIcon.svg" alt="Profile" className={styles.profileIcon} />
        <span className={`${styles.menuText} ${showProfileTooltip ? styles.visible : ''}`}>
          Profile
        </span>
      </Link>
      <div
        className={styles.signoutMenu}
        style={{
          opacity: showMenu ? 1 : 0,
          transform: showMenu ? 'translateY(0)' : 'translateY(10px)',
          pointerEvents: showMenu ? 'auto' : 'none'
        }}
      >
        <button className={styles.signoutButton} onClick={handleSignOut}>
          <img src="/img/signout.svg" alt="Sign Out" className={styles.signoutIcon} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu; 