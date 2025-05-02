import React from 'react';
import styles from './SalesFunnel.module.css';

const SalesFunnel = () => {
  return (
    <section className={styles.funnelSection}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Transform Your Sales Process</h2>
          <p className={styles.description}>
            Our integrated sales funnel helps you capture, nurture, and close leads in a streamlined process
          </p>
        </div>
        
        <div className={styles.funnelContainer}>
          <div className={styles.funnelStages}>
            <div className={styles.stageItem}>
              <div className={styles.stageConnect}></div>
              <h3 className={styles.stageTitle}>CAPTURE</h3>
              <p className={styles.stageDescription}>
                Attract and convert visitors into leads with our comprehensive toolkit
              </p>
            </div>
            
            <div className={styles.stageItem}>
              <div className={styles.stageConnect}></div>
              <h3 className={styles.stageTitle}>NURTURE</h3>
              <p className={styles.stageDescription}>
                Build relationships and guide prospects through personalized journeys
              </p>
            </div>
            
            <div className={styles.stageItem}>
              <div className={styles.stageConnect}></div>
              <h3 className={styles.stageTitle}>CLOSE</h3>
              <p className={styles.stageDescription}>
                Convert leads into customers with effective closing strategies and tools
              </p>
            </div>
          </div>
          
          <div className={styles.funnelVisualization}>
            <div className={styles.captureStage}></div>
            <div className={styles.nurtureStage}></div>
            <div className={styles.closeStage}></div>
            
            <div className={styles.socialIcons}>
              <div className={styles.socialIcon}></div>
              <div className={styles.socialIcon}></div>
              <div className={styles.socialIcon}></div>
              <div className={styles.socialIcon}></div>
              <div className={styles.socialIcon}></div>
              <div className={styles.socialIcon}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesFunnel; 