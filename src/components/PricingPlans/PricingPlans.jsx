import React from 'react';
import styles from './PricingPlans.module.css';

const PricingPlans = () => {
  return (
    <section className={styles.pricingSection}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>We have plans for everyone!</h2>
          <p className={styles.description}>
            We started with a strong foundation, then simply built all of the sales and
            marketing tools ALL businesses need under one platform.
          </p>
        </div>
        
        <div className={styles.plansWrapper}>
          {/* Starter Plan */}
          <div className={styles.planCard}>
            <h3 className={styles.planTitle}>STARTER</h3>
            <p className={styles.planDescription}>
              Best for local businesses needing to improve their online reputation.
            </p>
            
            <div className={styles.priceWrapper}>
              <div className={styles.price}>$199</div>
              <div className={styles.priceInterval}>
                <div className={styles.monthly}>/monthly</div>
              </div>
            </div>
            
            <div className={styles.featuresList}>
              <h4 className={styles.featuresTitle}>What's included</h4>
              
              <ul className={styles.features}>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>Unlimited Users</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>GMB Messaging</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>Reputation Management</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>GMB Call Tracking</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>24/7 Award Winning Support</span>
                </li>
              </ul>
            </div>
            
            <button className={styles.signUpButton}>SIGN UP FOR STARTER</button>
          </div>
          
          {/* Grow Plan */}
          <div className={styles.planCard}>
            <h3 className={styles.planTitle}>GROW</h3>
            <p className={styles.planDescription}>
              Best for all businesses that want to take full control of their
              marketing automation and track their leads, click to close.
            </p>
            
            <div className={styles.priceWrapper}>
              <div className={styles.price}>$399</div>
              <div className={styles.priceInterval}>
                <div className={styles.monthly}>/monthly</div>
              </div>
            </div>
            
            <div className={styles.featuresList}>
              <h4 className={styles.featuresTitle}>What's included</h4>
              
              <ul className={styles.features}>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>Pipeline Management</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>Marketing Automation Campaigns</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>Live Call Transfer</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>GMB Messaging</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>Embed-able Form Builder</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>Reputation Management</span>
                </li>
                <li className={styles.featureItem}>
                  <div className={styles.checkIcon}>
                    <div className={styles.icon}></div>
                  </div>
                  <span>24/7 Award Winning Support</span>
                </li>
              </ul>
            </div>
            
            <button className={styles.signUpButton}>SIGN UP FOR GROW</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans; 