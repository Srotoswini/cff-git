"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./ProductSection.module.css";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";

export default function ProductSection({ title, viewAllLink, categoryName = null }) {
  const scrollRef = useRef(null);
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = categoryName
          ? `${baseUrl}/api/products/category?name=${encodeURIComponent(categoryName)}`
          : `${baseUrl}/api/products`;
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err.message);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [categoryName]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 200;
    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to continue");

    try {
      await axios.post(`${baseUrl}/api/cart`, { product_id: productId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
    } catch (err) {
      console.error("Add to Cart failed:", err.message);
    }
  };

  const increment = async (productId) => {
    const quantity = (quantities[productId] || 0) + 1;
    await handleAddToCart(productId, quantity);
    setQuantities((prev) => ({ ...prev, [productId]: quantity }));
  };

  const decrement = (productId) => {
    const current = quantities[productId] || 0;
    if (current <= 1) {
      const updated = { ...quantities };
      delete updated[productId];
      setQuantities(updated);
    } else {
      setQuantities((prev) => ({ ...prev, [productId]: current - 1 }));
    }
  };

  return (
    <section id={title.toLowerCase().replace(/\s/g, "-")} className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <Link href={viewAllLink} className={styles.viewAll}>View all</Link>
      </div>

      <div className={styles.carouselWrapper}>
        <button className={`${styles.arrowButton} ${styles.leftArrow}`} onClick={() => scroll("left")}><FaChevronLeft /></button>

        <div className={styles.productGrid} ref={scrollRef}>
          {products.length > 0 ? products.map((product) => {
            const quantity = quantities[product.product_id] || 0;
            return (
              <div key={product.product_id} className={styles.productCard}>
                <Link href={{ pathname: "/product-details", query: { data: JSON.stringify(product) } }}>
                  <img src={product.image_url} alt={product.name} className={styles.productImage} style={{ cursor: "pointer" }} />
                </Link>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.priceSection}>
                  <span className={styles.price}>₹{product.sale_price}</span>
                  <span className={styles.originalPrice}>₹{product.price}</span>
                </div>
                {quantity === 0 ? (
                  <button className={styles.addToCart} onClick={() => handleAddToCart(product.product_id)}>Add to Cart</button>
                ) : (
                  <div className={styles.quantityControl}>
                    <button onClick={() => decrement(product.product_id)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => increment(product.product_id)}>+</button>
                  </div>
                )}
              </div>
            );
          }) : (
            <p className={styles.emptyMsg}>No products found.</p>
          )}
        </div>

        <button className={`${styles.arrowButton} ${styles.rightArrow}`} onClick={() => scroll("right")}><FaChevronRight /></button>
      </div>
    </section>
  );
}
