// HomePage.jsx
import React from "react";
import styles from "./HomePage.module.css";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProductSection from "../components/ProductSection";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <HeroSection />

      <ProductSection 
        title="All Products" 
        viewAllLink="#" 
        products={[...Array(5).keys()].map(i => ({
          id: `all-${i}`,
          name: "Desi Tilapia (Size-900g)",
          price: "₹950.00",
          originalPrice: "₹1200.00",
          image: "/fish2.jpg",
          nutrition: {
            calories: 150,
            protein: 20,
            fat: 5,
            carbs: 0,
          }
        }))}
      />

      <ProductSection 
        title="Exclusive Offers" 
        viewAllLink="#" 
        products={[...Array(5).keys()].map(i => ({
          id: `exclusive-${i}`,
          name: "Aar Whole Fish / Premium Long Whiskered Catfish (Size-1.25kg)",
          price: "₹625.00",
          originalPrice: "₹750.00",
          image: "/fish.png",
          nutrition: {
            calories: 150,
            protein: 20,
            fat: 5,
            carbs: 0,
          }
        }))}
      />

      <ProductSection 
        title="Buy Again" 
        viewAllLink="#" 
        products={[...Array(4).keys()].map(i => ({
          id: `buyagain-${i}`,
          name: "Jumbo Prawns/ Galda (Cleaned & Deveined)",
          price: "₹499.00",
          originalPrice: "₹599.00",
          image: "/fish3.jpg",
          nutrition: {
            calories: 150,
            protein: 20,
            fat: 5,
            carbs: 0,
          }
        }))}
      />

      <ProductSection 
        title="Best Sellers" 
        viewAllLink="#" 
        products={[...Array(6).keys()].map(i => ({
          id: `bestseller-${i}`,
          name: "Aar Whole Fish",
          price: "₹625.00",
          originalPrice: "₹750.00",
          image: "/fish.png",
          nutrition: {
            calories: 150,
            protein: 20,
            fat: 5,
            carbs: 0,
          }
        }))}
      />
    </div>
  );
}
