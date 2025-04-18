"use client";

import React, { useState } from "react";
import styles from "./ProductDetails.module.css";

export default function ProductDetails({ product }) {
  const [selectedCut, setSelectedCut] = useState("Whole");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("1kg");

  const handleAddToCart = () => {
    alert(`Added ${quantity} of ${product.name} (${weight}, ${selectedCut}) to cart`);
  };

  return (
    <div className={styles.container}>
      {/* Left: Image gallery */}
      <div className={styles.gallery}>
        <img src={product.image} alt={product.name} className={styles.mainImage} />
        <div className={styles.thumbnailRow}>
          {[1, 2, 3].map((n) => (
            <img
              key={n}
              src={product.image}
              alt={`Thumbnail ${n}`}
              className={styles.thumbnail}
            />
          ))}
        </div>
      </div>

      {/* Right: Product info */}
      <div className={styles.info}>
        <h1>{product.name}</h1>
        <div className={styles.price}>₹{product.price}</div>
        <p className={styles.desc}>
          Fresh {product.name} cleaned and ready to cook. Perfect for curry, fry, or grill.
        </p>

        <div className={styles.section}>
          <span>Cut Type:</span>
          <div className={styles.options}>
            {["Whole", "Steaks", "Boneless"].map((type) => (
              <button
                key={type}
                className={`${styles.option} ${selectedCut === type ? styles.active : ""}`}
                onClick={() => setSelectedCut(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <span>Weight:</span>
          <select
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={styles.dropdown}
          >
            <option value="500g">500g</option>
            <option value="1kg">1kg</option>
            <option value="1.5kg">1.5kg</option>
          </select>
        </div>

        <div className={styles.quantityRow}>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <button className={styles.cartButton} onClick={handleAddToCart}>
          Add to Cart
        </button>
            {/* Nutrition Info */}
{product.nutrition && (
  <div className={styles.nutritionBox}>
    <h4>
      Nutrition Info <span>(per 100g)</span>
    </h4>
    <ul>
      <li>
        <span>Calories</span>
        <strong>{product.nutrition.calories}</strong>
      </li>
      <li>
        <span>Protein</span>
        <strong>{product.nutrition.protein}g</strong>
      </li>
      <li>
        <span>Fat</span>
        <strong>{product.nutrition.fat}g</strong>
      </li>
      <li>
        <span>Carbs</span>
        <strong>{product.nutrition.carbs}g</strong>
      </li>
    </ul>
  </div>
)}
    
      </div>
    </div>
  );
}
