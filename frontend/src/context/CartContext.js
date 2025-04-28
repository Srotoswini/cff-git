// context/CartContext.js
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${baseUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data.items || [];
      const count = items.reduce((acc, item) => acc + item.qty, 0);
      setCartCount(count);
    } catch (err) {
      console.error("Failed to fetch cart count:", err.message);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
