import React from 'react';
import styles from './CrmFeatures.module.css';

const CrmFeatures = () => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>At its core, Hubly is a robust CRM solution.</h2>
          <p className={styles.description}>
            Hubly helps businesses streamline customer interactions, track leads, and automate tasks—
            saving you time and maximizing revenue. Whether you're a startup or an enterprise, Hubly
            adapts to your needs, giving you the tools to scale efficiently.
          </p>
        </div>
        
        <div className={styles.funnelWrapper}>
          <div className={styles.funnelTextContent}>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>MULTIPLE PLATFORMS TOGETHER!</h3>
              <p className={styles.featureDescription}>
                Email communication is a breeze with our fully integrated, drag & drop email builder.
              </p>
            </div>
            
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>CLOSE</h3>
              <p className={styles.featureDescription}>
                Capture leads using our landing pages, surveys, forms, calendars, inbound phone system & more.
              </p>
            </div>
            
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>NURTURE</h3>
              <p className={styles.featureDescription}>
                Capture leads using our landing pages, surveys, forms, calendars, inbound phone system & more.
              </p>
            </div>
          </div>
          
          <div className={styles.funnelImage}>
            <div className={styles.socialWrapper}>
              <img 
                src={process.env.PUBLIC_URL + '/img/PlatformTogetherSocial.svg'} 
                alt="Social Media Platforms" 
                className={styles.socialImg}
              />
            </div>
            
            <div className={styles.funnelGraphic}>
              <img 
                src={process.env.PUBLIC_URL + '/img/PlatformTogether.svg'} 
                alt="Sales Funnel" 
                className={styles.funnelImg}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrmFeatures; 