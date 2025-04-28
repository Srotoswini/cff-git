"use client";

import React from "react";
import styles from "./HomePage.module.css";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProductSection from "./ProductSection";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <HeroSection />

      {/* Fetch ALL products */}
      <ProductSection 
        title="All Products" 
        viewAllLink="/all-products" 
        categoryName={null} // ✅ No category → fetch all
      />

      {/* Category: Exclusive */}
      <ProductSection 
        title="Exclusive Offers" 
        viewAllLink="/all-products" 
        categoryName={null} 
      />

      {/* Category: Buy Again */}
      <ProductSection 
        title="Buy Again" 
        viewAllLink="/buy-again" 
        categoryName="Buy Again" 
      />

      {/* Category: Best Sellers */}
      <ProductSection 
        title="Best Sellers" 
        viewAllLink="/all-products" 
        categoryName={null} 
      />
    </div>
  );
}
