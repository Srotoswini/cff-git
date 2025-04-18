'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import Image from 'next/image';
import styles from '@/components/ProductDetails.module.css';

function ProductDetails() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  const product = data ? JSON.parse(data) : null;

  const [cutType, setCutType] = useState('Whole');
  const [weight, setWeight] = useState('1kg');
  const [qty, setQty] = useState(1);

  if (!product) return <p>Product not found</p>;

  const handleAddToCart = () => {
    alert(`Added ${qty} of ${product.name} (${weight}, ${cutType}) to cart.`);
  };

  return (
    <div className={styles.container}>
      {/* Left: Image Gallery */}
      <div className={styles.gallery}>
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={350}
          className={styles.mainImage}
        />
        <div className={styles.thumbnailRow}>
          {[1, 2, 3].map((n) => (
            <Image
              key={n}
              src={product.image}
              alt={`Thumbnail ${n}`}
              width={100}
              height={100}
              className={styles.thumbnail}
            />
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className={styles.info}>
        <h1>{product.name}</h1>
        <div className={styles.price}>₹{product.price}</div>
        <p className={styles.desc}>
          Freshly cut {product.name}, perfect for curry, fry or grill. Cleaned, packed and delivered to your doorstep.
        </p>

        {/* Cut Type Selection */}
        <div className={styles.section}>
          <span>Cut Type:</span>
          <div className={styles.options}>
            {['Whole', 'Steaks', 'Boneless'].map((type) => (
              <button
                key={type}
                className={`${styles.option} ${cutType === type ? styles.active : ''}`}
                onClick={() => setCutType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className={styles.quantityRow}>
          <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>

        {/* Add to Cart Button */}
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

// Wrapping in Suspense to fix useSearchParams CSR warning
export default function ProductDetailsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails />
    </Suspense>
  );
}
