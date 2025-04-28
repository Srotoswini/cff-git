"use client";

import React, { useEffect, useState } from "react";
import styles from "./Category.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function Category() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedFromQuery = searchParams.get("type") || "All";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchProducts = async (category) => {
    try {
      const url = category && category !== "All"
        ? `${baseUrl}/api/products/category?name=${encodeURIComponent(category)}`
        : `${baseUrl}/api/products`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products by category:", err);
    }
  };

  useEffect(() => {
    setSelectedCategory(selectedFromQuery);
    fetchProducts(selectedFromQuery);
  }, [selectedFromQuery]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    router.push(`/category?type=${encodeURIComponent(cat)}`);
  };

  const handleAddToCart = async (e, productId, quantity = 1) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login");

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
    const newQty = (quantities[productId] || 0) + 1;
    handleAddToCart(e, productId, newQty);
  };

  const decrement = (e, productId) => {
    e.preventDefault();
    const current = quantities[productId] || 0;
    if (current > 1) {
      handleAddToCart(e, productId, current - 1);
    } else {
      const updated = { ...quantities };
      delete updated[productId];
      setQuantities(updated);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroBanner}>
        <h1>FRESH FISH & MEAT</h1>
        <p>Browse through our curated cuts of fish, seafood, and premium meat</p>
      </div>

      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <h3>Filters</h3>
          <button onClick={() => handleCategoryClick("All")} className={selectedCategory === "All" ? styles.active : ""}>All</button>
          {["Exclusive Fish & Meat", "Fish & Seafood", "Mutton", "Poultry", "Steak & Fillets"].map((cat) => (
            <button key={cat} onClick={() => handleCategoryClick(cat)} className={selectedCategory === cat ? styles.active : ""}>
              {cat}
            </button>
          ))}
        </aside>

        <section className={styles.productGrid}>
          {products.map((product) => {
            const quantity = quantities[product.product_id] || 0;
            return (
              <Link key={product.product_id} href={{ pathname: "/product-details", query: { data: JSON.stringify(product) } }} className={styles.card}>
                <img src={product.image_url} alt={product.name} className={styles.image} />
                <h4>{product.name}</h4>
                <p className={styles.price}>₹{product.sale_price}</p>
                {quantity === 0 ? (
                  <button className={styles.addToCart} onClick={(e) => handleAddToCart(e, product.product_id)}>Add to Cart</button>
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
        </section>
      </div>
    </div>
  );
}
