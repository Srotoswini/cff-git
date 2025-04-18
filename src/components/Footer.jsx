import React from "react";
import styles from "./Footer.module.css";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* Middle Contact/App */}
      <div className={styles.middleStrip}>
        <div className={styles.support}>
          <span className={styles.phoneIcon}>📞</span>
          <div>
            <strong>9123929282</strong>
            <p>Call or WhatsApp Us</p>
          </div>
        </div>

        <div className={styles.appPromo}>
          <strong>Download Our App</strong>
          <p>15% off on your first order</p>
          <div className={styles.appButtons}>
            <img src="/google-play.png" alt="Google Play" />
            <img src="/app-store.png" alt="App Store" />
          </div>
        </div>

        <div className={styles.socials}>
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
        </div>
      </div>

      {/* Bottom Legal Strip */}
      <div className={styles.bottomStrip}>
        <span>© {new Date().getFullYear()} Calcutta Fresh Foods</span>
        <div className={styles.links}>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}
