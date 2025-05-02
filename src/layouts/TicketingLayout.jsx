import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import styles from './TicketingLayout.module.css';
import '../styles/layout.css';

const TicketingLayout = ({ children }) => {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
      <div className={styles.contentArea}>
        {children}
        </div>
      </div>
    </div>
  );
};

export default TicketingLayout; 