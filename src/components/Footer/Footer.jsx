import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logoLink}>
            <img src={process.env.PUBLIC_URL + '/img/logoHubly.svg'} alt="Hubly Logo" className={styles.logo} />
          </Link>
        </div>
        
        <div className={styles.linksContainer}>
          <div className={styles.linkSection}>
            <h3 className={styles.sectionTitle}>Product</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.footerLink}>Universal Checkout</a></li>
              <li><a href="#" className={styles.footerLink}>Payment workflows</a></li>
              <li><a href="#" className={styles.footerLink}>Observability</a></li>
              <li><a href="#" className={styles.footerLink}>UpliftAI</a></li>
              <li><a href="#" className={styles.footerLink}>Apps & integrations</a></li>
            </ul>
          </div>
          
          <div className={styles.linkSection}>
            <h3 className={styles.sectionTitle}>Why Primer</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.footerLink}>Expand to new markets</a></li>
              <li><a href="#" className={styles.footerLink}>Boost payment success</a></li>
              <li><a href="#" className={styles.footerLink}>Improve conversion rates</a></li>
              <li><a href="#" className={styles.footerLink}>Reduce payments fraud</a></li>
              <li><a href="#" className={styles.footerLink}>Recover revenue</a></li>
            </ul>
          </div>
          
          <div className={styles.linkSection}>
            <h3 className={styles.sectionTitle}>Developers</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.footerLink}>Primer Docs</a></li>
              <li><a href="#" className={styles.footerLink}>API Reference</a></li>
              <li><a href="#" className={styles.footerLink}>Payment methods guide</a></li>
              <li><a href="#" className={styles.footerLink}>Service status</a></li>
              <li><a href="#" className={styles.footerLink}>Community</a></li>
            </ul>
          </div>
          
          <div className={styles.linkSection}>
            <h3 className={styles.sectionTitle}>Resources</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.footerLink}>Blog</a></li>
              <li><a href="#" className={styles.footerLink}>Success stories</a></li>
              <li><a href="#" className={styles.footerLink}>News room</a></li>
              <li><a href="#" className={styles.footerLink}>Terms</a></li>
              <li><a href="#" className={styles.footerLink}>Privacy</a></li>
            </ul>
          </div>
          
          <div className={styles.linkSection}>
            <h3 className={styles.sectionTitle}>Company</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.footerLink}>About us</a></li>
              <li><a href="#" className={styles.footerLink}>Careers</a></li>
              <li><a href="#" className={styles.footerLink}>Contact</a></li>
            </ul>
            
            <div className={styles.socialLinks}>
              <a href="https://mail.google.com/" className={styles.socialLink} aria-label="Email">
                <img src={process.env.PUBLIC_URL + '/img/mail.svg'} alt="Email" className={styles.socialIcon} />
              </a>
              <a href="https://www.linkedin.com/" className={styles.socialLink} aria-label="LinkedIn">
                <img src={process.env.PUBLIC_URL + '/img/linkedin.svg'} alt="LinkedIn" className={styles.socialIcon} />
              </a>
              <a href="https://x.com/" className={styles.socialLink} aria-label="Twitter">
                <img src={process.env.PUBLIC_URL + '/img/twitter.svg'} alt="Twitter" className={styles.socialIcon} />
              </a>
              <a href="https://www.youtube.com/" className={styles.socialLink} aria-label="YouTube">
                <img src={process.env.PUBLIC_URL + '/img/yt.svg'} alt="YouTube" className={styles.socialIcon} />
              </a>
              <a href="https://discord.com/" className={styles.socialLink} aria-label="Discord">
                <img src={process.env.PUBLIC_URL + '/img/dis.svg'} alt="Discord" className={styles.socialIcon} />
              </a>
              <a href="https://www.figma.com/" className={styles.socialLink} aria-label="Figma">
                <img src={process.env.PUBLIC_URL + '/img/figma.svg'} alt="Figma" className={styles.socialIcon} />
              </a>
              <a href="https://www.instagram.com/" className={styles.socialLink} aria-label="Instagram">
                <img src={process.env.PUBLIC_URL + '/img/instaGuu.svg'} alt="Instagram" className={styles.socialIcon} />
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.copyright}>
          © {currentYear} Hubly. All rights reserved.
        </div>
      </div>
      
      {/* Background Ellipse */}
      <div className={styles.backgroundEllipse}></div>
    </footer>
  );
};

export default Footer; 