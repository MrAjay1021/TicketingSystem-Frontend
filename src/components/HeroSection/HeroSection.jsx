import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.contentCol}>
          <h1 className={styles.title}>
            Grow Your Business Faster with Hubly CRM
          </h1>
          <p className={styles.description}>
            Manage leads, automate workflows, and close deals effortlessly—all in one powerful platform.
          </p>
          <div className={styles.actionButtons}>
            <Link to="/signup" className={styles.getStartedButton}>
              Get started
              <svg className={styles.arrowIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button className={styles.watchVideoButton}>
              <div className={styles.videoIcon}>
                <img src={process.env.PUBLIC_URL + '/img/watchVideoSign.svg'} alt="Play" />
              </div>
              <span>Watch Video</span>
            </button>
          </div>
        </div>
        
        <div className={styles.imageCol}>
          <div className={styles.dashboardImage}>
            <img src={process.env.PUBLIC_URL + '/img/main.svg'} alt="Dashboard" />
          </div>
          
          <div className={styles.calendarCard}>
            <img src={process.env.PUBLIC_URL + '/img/Calendar.svg'} alt="Calendar" />
          </div>
          
          <div className={styles.statsCard}>
            <img src={process.env.PUBLIC_URL + '/img/Calendarcard2.svg'} alt="Statistics" />
          </div>
          <div className={styles.notificationCard}>
            <div className={styles.avatar}>
              <img src={process.env.PUBLIC_URL + '/img/team.svg'} alt="User avatar" />
            </div>
            <div className={styles.notificationContent}>
              <div className={styles.userName}>Jerry Calzoni joined Swimming</div>
              <div className={styles.timeStamp}>Class - 9:22 AM</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.partnersBar}>
        <div className={styles.partnersContainer}>
          <div className={styles.partner}>
            <img src={process.env.PUBLIC_URL + '/img/adobe.svg'} alt="Adobe" />
          </div>
          <div className={styles.partner}>
            <img src={process.env.PUBLIC_URL + '/img/elastic.svg'} alt="Elastic" />
          </div>
          <div className={styles.partner}>
            <img src={process.env.PUBLIC_URL + '/img/opendoor.svg'} alt="Opendoor" />
          </div>
          <div className={styles.partner}>
            <img src={process.env.PUBLIC_URL + '/img/airTable.svg'} alt="Airtable" />
          </div>
          <div className={styles.partner}>
            <img src={process.env.PUBLIC_URL + '/img/elastic.svg'} alt="Elastic" />
          </div>
          <div className={styles.partner}>
            <img src={process.env.PUBLIC_URL + '/img/framer.svg'} alt="Framer" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 