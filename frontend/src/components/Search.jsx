"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./Search.module.css";
import axios from "axios";
import Link from "next/link";

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/products/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  const handleAddToCart = async (e, productId, quantity = 1) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      await axios.post(`${baseUrl}/api/cart`, {
        product_id: productId,
        quantity,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuantities((prev) => ({ ...prev, [productId]: quantity }));
    } catch (err) {
      console.error("Add to Cart Error:", err.message);
    }
  };

  const increment = (e, productId) => {
    e.preventDefault();
    setQuantities((prev) => {
      const newQty = (prev[productId] || 0) + 1;
      handleAddToCart(e, productId, newQty);
      return { ...prev, [productId]: newQty };
    });
  };

  const decrement = (e, productId) => {
    e.preventDefault();
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      handleAddToCart(e, productId, current - 1);
      return { ...prev, [productId]: current - 1 };
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Search Results for "{query}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className={styles.grid}>
          {results.map((product) => {
            const quantity = quantities[product.product_id] || 0;
            return (
              <Link
                key={product.product_id}
                href={{ pathname: "/product-details", query: { data: JSON.stringify(product) } }}
                className={styles.card}
              >
                <img src={product.image_url} alt={product.name} className={styles.image} />
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.priceSection}>
                  <span className={styles.price}>₹{product.sale_price}</span>
                  <span className={styles.original}>₹{product.price}</span>
                </div>
                {quantity === 0 ? (
                  <button className={styles.addToCart} onClick={(e) => handleAddToCart(e, product.product_id)}>
                    Add to Cart
                  </button>
                ) : (
                  <div className={styles.quantityControl}>
                    <button onClick={(e) => decrement(e, product.product_id)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={(e) => increment(e, product.product_id)}>+</button>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
