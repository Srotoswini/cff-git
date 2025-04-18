"use client";

import React, { useRef, useState } from "react";
import styles from "./ProductSection.module.css";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ProductSection({ title, viewAllLink, products = [] }) {
  const scrollRef = useRef(null);
  const [quantities, setQuantities] = useState({});

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (productId) => {
    setQuantities((prev) => ({ ...prev, [productId]: 1 }));
  };

  const increment = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decrement = (productId) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  return (
    <section id="exclusive-offers" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <Link href={viewAllLink} className={styles.viewAll}>
          View all
        </Link>
      </div>

      <div className={styles.carouselWrapper}>
        <button
          className={`${styles.arrowButton} ${styles.leftArrow}`}
          onClick={() => scroll("left")}
        >
          <FaChevronLeft />
        </button>

        <div className={styles.productGrid} ref={scrollRef}>
          {products.length > 0 ? (
            products.map((product) => {
              const quantity = quantities[product.id] || 0;

              return (
                <div key={product.id} className={styles.productCard}>
                  <Link
                    href={{
                      pathname: "/product-details",
                      query: { data: JSON.stringify(product) },
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                      style={{ cursor: "pointer" }}
                    />
                  </Link>

                  <h3 className={styles.productName}>{product.name}</h3>

                  <div className={styles.priceSection}>
                    <span className={styles.price}>{product.price}</span>
                    <span className={styles.originalPrice}>{product.originalPrice}</span>
                  </div>

                  {quantity === 0 ? (
                    <button
                      className={styles.addToCart}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className={styles.quantityControl}>
                      <button onClick={() => decrement(product.id)}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => increment(product.id)}>+</button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className={styles.emptyMsg}>No products found.</p>
          )}
        </div>

        <button
          className={`${styles.arrowButton} ${styles.rightArrow}`}
          onClick={() => scroll("right")}
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
