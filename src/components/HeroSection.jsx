"use client";

import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = ["hero-bg1.png", "hero-bg2.png", "hero-bg3.png", "hero-bg4.png"];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const contentMap = {
    "hero-bg1.png": {
      heading: (
        <>
          Fresh Fish & Meat Delivered <br />
          to Your Doorstep
        </>
      ),
      subheading:
        "Experience the goodness of freshness. Either it's fresh or it's free!",
    },
    "hero-bg2.png": {
      heading: (
        <>
          Farm-Fresh Chicken Delivered <br />
          Right to Your Doorstep
        </>
      ),
      subheading: "Juicy, and flavorful — because your family deserves the best.",
    },
    "hero-bg3.png": {
      heading: (
        <>
          Juicy Mutton Cuts Delivered <br />
          Fresh to Your Kitchen
        </>
      ),
      subheading:
        "Hand-selected, tender, and 100% fresh. Taste the richness with every bite.",
    },
    "hero-bg4.png": {
      heading: (
        <>
          Premium Prawns Packed <br />
          With Ocean Freshness
        </>
      ),
      subheading: "Cleaned, deveined, and ready to cook — savor the taste of the sea!",
    },
  };

  const bgImage = images[currentIndex];
  const selectedContent = contentMap[bgImage];

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(goNext, 6000); // 🔁 6 seconds
    return () => clearInterval(interval);
  }, []);

  const handleScrollToOffers = () => {
    const target = document.getElementById("exclusive-offers");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={styles.hero}
      style={{ backgroundImage: `url('/${bgImage}')` }}
    >
      <div className={styles.arrowLeft} onClick={goPrev}>
        <FaChevronLeft />
      </div>
      <div className={styles.arrowRight} onClick={goNext}>
        <FaChevronRight />
      </div>

      <div>
        <h1>{selectedContent.heading}</h1>
        <p>{selectedContent.subheading}</p>
        <button className={styles.ctaButton} onClick={handleScrollToOffers}>
          Shop Now
        </button>
        <p className={styles.supportLine}>
          *Got a question? We're here to help — +91 91239-29282
        </p>
      </div>
    </div>
  );
}
