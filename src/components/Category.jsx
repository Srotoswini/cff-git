"use client";

import React, { useEffect, useState } from "react";
import styles from "./Category.module.css";
import { useSearchParams } from "next/navigation";

const categories = [
  "Exclusive Fish & Meat",
  "Fish & Seafood",
  "Mutton",
  "Poultry",
  "Steak & Fillets",
];

const sampleProducts = [
  {
    id: 1,
    name: "Premium Rohu Fish (1kg)",
    price: "₹449.00",
    category: "Fish & Seafood",
    image: "/fish.png",
  },
  {
    id: 2,
    name: "Boneless Chicken Breast",
    price: "₹299.00",
    category: "Poultry",
    image: "/meat.jpg",
  },
  {
    id: 3,
    name: "Fresh Prawn Curry Cut",
    price: "₹649.00",
    category: "Mutton",
    image: "/fish3.jpg",
  },
  {
    id: 4,
    name: "Telapia Fillet (500g)",
    price: "₹899.00",
    category: "Steak & Fillets",
    image: "/fish2.jpg",
  },
];

export default function Category() {
  const searchParams = useSearchParams();
  const selectedFromQuery = searchParams.get("type");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (selectedFromQuery && categories.includes(selectedFromQuery)) {
      setSelectedCategory(selectedFromQuery);
    } else {
      setSelectedCategory("All");
    }
  }, [selectedFromQuery]);

  const filteredProducts =
    selectedCategory === "All"
      ? sampleProducts
      : sampleProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className={styles.container}>
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <h1>FRESH FISH & MEAT</h1>
        <p>Browse through our curated cuts of fish, seafood, and premium meat</p>
      </div>

      <div className={styles.main}>
        {/* Filters */}
        <aside className={styles.sidebar}>
          <h3>Filters</h3>
          <button
            onClick={() => setSelectedCategory("All")}
            className={selectedCategory === "All" ? styles.active : ""}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? styles.active : ""}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Product Grid */}
        <section className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.card}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.image}
              />
              <h4>{product.name}</h4>
              <p className={styles.price}>{product.price}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
