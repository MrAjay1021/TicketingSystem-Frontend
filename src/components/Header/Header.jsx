import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={process.env.PUBLIC_URL + '/img/logoHubly.svg'} alt="Hubly Logo" />
          </Link>
        </div>
        <div className={styles.navigation}>
          <div className={styles.navButtons}>
            <Link to="/login" className={styles.loginButton}>Login</Link>
            <Link to="/signup" className={styles.signupButton}>Sign up</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 