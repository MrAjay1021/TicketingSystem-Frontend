import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.css';
import '../../styles/layout.css';

const Layout = ({ children }) => {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout; 