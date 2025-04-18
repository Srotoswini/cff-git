"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaUser,
  FaClipboardList,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleCategoryClick = (category) => {
    router.push(`/category?type=${encodeURIComponent(category)}`);
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => router.push("/login");

  return (
    <header className={styles.navbar}>
      <div className={styles.navContent}>
        {/* Logo and Hamburger */}
        <div className={styles.leftGroup}>
          <Image
            src="/logo.png"
            alt="Calcutta Fresh Foods Logo"
            width={180}
            height={60}
            className={styles.logo}
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}
          />
          <button
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            role="button"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className={`${styles.desktopMenu}`}>
          <div className={styles.centerGroup}>
            <div className={styles.searchWrapper}>
              <FaSearch className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Search for products..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.searchWrapper}>
              <FaMapMarkerAlt className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Search location..."
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.rightGroup}>
            <div className={styles.categoryWrapper}>
              <button className={styles.categoryButton} onClick={toggleDropdown}>
                Shop by <strong>Category</strong>
              </button>
              {showDropdown && (
                <ul className={styles.dropdown}>
                  {[
                    "Exclusive Fish & Meat",
                    "Fish & Seafood",
                    "Mutton",
                    "Poultry",
                    "Steak & Fillets",
                  ].map((cat) => (
                    <li key={cat} onClick={() => handleCategoryClick(cat)}>
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.navItem} onClick={() => router.push("/myorder")}>
              <FaClipboardList className={styles.icon} /> My Orders
            </div>
            <div className={styles.navItem} onClick={() => router.push("/mycart")}>
              <FaShoppingCart className={styles.icon} /> Cart
            </div>
            <div className={styles.navItem} onClick={() => router.push("/profile")}>
              <FaUser className={styles.icon} />
            </div>
            <button className={styles.loginButton} onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.searchWrapper}>
              <FaSearch className={styles.inputIcon} />
              <input type="text" placeholder="Search for products..." className={styles.searchInput} />
            </div>
            <div className={styles.searchWrapper}>
              <FaMapMarkerAlt className={styles.inputIcon} />
              <input type="text" placeholder="Search location..." className={styles.searchInput} />
            </div>

            <div className={styles.categoryWrapper}>
              <button className={styles.categoryButton} onClick={toggleDropdown}>
                Shop by <strong>Category</strong>
              </button>
              {showDropdown && (
                <ul className={styles.dropdown}>
                  {[
                    "Exclusive Fish & Meat",
                    "Fish & Seafood",
                    "Mutton",
                    "Poultry",
                    "Steak & Fillets",
                  ].map((cat) => (
                    <li key={cat} onClick={() => handleCategoryClick(cat)}>
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.navItem} onClick={() => router.push("/myorder")}>
              <FaClipboardList className={styles.icon} /> My Orders
            </div>
            <div className={styles.navItem} onClick={() => router.push("/mycart")}>
              <FaShoppingCart className={styles.icon} /> Cart
            </div>
            <div className={styles.navItem} onClick={() => router.push("/profile")}>
              <FaUser className={styles.icon} /> Profile
            </div>
            <button className={styles.loginButton} onClick={handleLoginClick}>
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
