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
} from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCategoryClick = (category) => {
    router.push(`/category?type=${encodeURIComponent(category)}`);
    setShowDropdown(false); // Close dropdown after navigation
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navContent}>
        {/* Logo */}
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
        </div>

        {/* Search & Location */}
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

        {/* Right Group */}
        <div className={styles.rightGroup}>
          {/* Category Dropdown */}
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

          <div
  className={styles.navItem}
  onClick={() => router.push("/myorder")}
  style={{ cursor: "pointer" }}
>
  <FaClipboardList className={styles.icon} /> My Orders
</div>

<div
  className={styles.navItem}
  onClick={() => router.push("/mycart")}
  style={{ cursor: "pointer" }}
>
  <FaShoppingCart className={styles.icon} /> Cart
</div>

          <div
            className={styles.navItem}
            onClick={() => router.push("/profile")}
            style={{ cursor: "pointer" }}
          >
            <FaUser className={styles.icon} />
          </div>

          <button className={styles.loginButton} onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
