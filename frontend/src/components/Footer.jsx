import React from "react";
import styles from "./Footer.module.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* Middle Contact/App */}
      <div className={styles.middleStrip}>
        <div className={styles.support}>
          <span className={styles.phoneIcon}>📞</span>
          <div className={styles.contactInfo}>
            <strong>9123929282</strong>
            <p>Call or WhatsApp Us</p>
            <a
              href="https://wa.me/919123929282"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappIcon}
            >
              {/* <FaWhatsapp size={40} /> */}
            </a>
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
