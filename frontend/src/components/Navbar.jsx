"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import axios from "axios";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaUser,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaCrosshairs,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const { cartCount, fetchCartCount } = useCart();

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleCategoryClick = (category) => {
    router.push(`/category?type=${encodeURIComponent(category)}`);
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => router.push("/login");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
              lat: latitude,
              lon: longitude,
              format: "json",
            },
          });
          const place = res.data?.address;
          const city = place?.city || place?.town || place?.village || "";
          const state = place?.state || "";
          setLocation(`${city}, ${state}`);
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          alert("Failed to fetch address from location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get current location.");
      }
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) fetchCartCount();
  }, []);

  const renderSearchBar = () => (
    <form onSubmit={handleSearch} className={styles.searchWrapper}>
      <FaSearch className={styles.inputIcon} />
      <input
        type="text"
        placeholder="Search for products..."
        className={styles.searchInput}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );

  const renderLocationInput = () => (
    <div className={styles.searchWrapper}>
      <FaMapMarkerAlt className={styles.inputIcon} />
      <input
        type="text"
        placeholder="Search location..."
        className={styles.searchInput}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <FaCrosshairs className={styles.geoIcon} onClick={getCurrentLocation} />
    </div>
  );

  const renderCartIcon = () => (
    <div className={styles.navItem} onClick={() => router.push("/mycart")}>
      <FaShoppingCart className={styles.icon} /> Cart
      {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
    </div>
  );

  return (
    <header className={styles.navbar}>
      <div className={styles.navContent}>
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

        <div className={styles.desktopMenu}>
          <div className={styles.centerGroup}>
            {renderSearchBar()}
            {renderLocationInput()}
          </div>

          <div className={styles.rightGroup}>
            <div className={styles.categoryWrapper}>
              <button className={styles.categoryButton} onClick={toggleDropdown}>
                Shop by <strong>Category</strong>
              </button>
              {showDropdown && (
                <ul className={styles.dropdown}>
                  {["Exclusive Fish & Meat", "Fish & Seafood", "Mutton", "Poultry", "Steak & Fillets"].map((cat) => (
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
            {renderCartIcon()}
            <div className={styles.navItem} onClick={() => router.push("/profile")}>
              <FaUser className={styles.icon} />
            </div>
            {!isLoggedIn && (
              <button className={styles.loginButton} onClick={handleLoginClick}>
                Login
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            {renderSearchBar()}
            {renderLocationInput()}
            <div className={styles.categoryWrapper}>
              <button className={styles.categoryButton} onClick={toggleDropdown}>
                Shop by <strong>Category</strong>
              </button>
              {showDropdown && (
                <ul className={styles.dropdown}>
                  {["Exclusive Fish & Meat", "Fish & Seafood", "Mutton", "Poultry", "Steak & Fillets"].map((cat) => (
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
            {renderCartIcon()}
            <div className={styles.navItem} onClick={() => router.push("/profile")}>
              <FaUser className={styles.icon} /> Profile
            </div>
            {!isLoggedIn && (
              <button className={styles.loginButton} onClick={handleLoginClick}>
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
