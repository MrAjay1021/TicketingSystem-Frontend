import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/Chat';
import styles from './MainLayout.module.css';

const MainLayout = ({ children, hideChat }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we are running on the client side
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // For mobile query users, we'll only show the chat component without landing page
  if (isMobile && hideChat) {
    return <ChatWidget />;
  }

  return (
    <div className={styles.mainLayout}>
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main className={styles.mainContent}>
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat widget - always visible */}
      <ChatWidget />
    </div>
  );
};

export default MainLayout; 