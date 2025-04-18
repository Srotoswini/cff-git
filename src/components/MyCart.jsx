"use client";

import React, { useState } from "react";
import styles from "./MyCart.module.css";
import { FaTrash } from "react-icons/fa";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Fresh Telapia Fish (1kg)",
      price: 799.0,
      qty: 1,
      image: "/fish2.jpg",
    },
    {
      id: 2,
      name: "Chicken Curry Cut (500g)",
      price: 249.0,
      qty: 2,
      image: "/meat.jpg",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState(getDateOptions()[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM - 12:00 PM");

  const timeSlots = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  function getDateOptions() {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const future = new Date(today);
      future.setDate(today.getDate() + i);
      dates.push(future.toDateString());
    }
    return dates;
  }

  const handleQtyChange = (id, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              qty:
                type === "inc"
                  ? item.qty + 1
                  : item.qty > 1
                  ? item.qty - 1
                  : 1,
            }
          : item
      )
    );
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div className={styles.container}>
      {cartItems.length === 0 ? (
        <p className={styles.empty}>Your cart is empty.</p>
      ) : (
        <>
          <div className={styles.cartList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.image}
                />
                <div className={styles.details}>
                  <h3>{item.name}</h3>

                  {/* Quantity Controller */}
                  <div className={styles.qtyControl}>
                    <button onClick={() => handleQtyChange(item.id, "dec")}>
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => handleQtyChange(item.id, "inc")}>
                      +
                    </button>
                  </div>

                  <p className={styles.price}>
                    ₹{(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
                <button className={styles.removeBtn}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            {/* 🚚 Delivery Slot Section */}
            <div className={styles.deliverySlot}>
              <h3>Delivery Slot</h3>
              <div className={styles.alertBox}>
                 <strong>No same day delivery</strong> on ordering after{" "}
                <strong>9:00 AM</strong>
              </div>

              <label>
                Select Delivery Date
                
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={styles.select}
                >
                  {getDateOptions().map((date, idx) => (
                    <option key={idx} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Select Delivery Time Slot
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className={styles.select}
                >
                  {timeSlots.map((slot, idx) => (
                    <option key={idx} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* 🧾 Payment Method Section */}
            <div className={styles.paymentSection}>
              <h3>Select Payment Method</h3>
              <div className={styles.paymentOptions}>
                <label>
                  <input type="radio" name="payment" defaultChecked /> Cash on
                  Delivery
                </label>
                <label>
                  <input type="radio" name="payment" /> UPI
                </label>
                <label>
                  <input type="radio" name="payment" /> Net Banking
                </label>
                <label>
                  <input type="radio" name="payment" /> Credit/Debit Card
                </label>
              </div>

              {/* 🧮 Order Summary */}
              <div className={styles.orderSummary}>
                <h4>Order Summary</h4>
                <div className={styles.summaryRow}>
                  <span>Items Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Delivery Charges</span>
                  <span>₹30</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <strong>Amount Payable</strong>
                  <strong>₹{(total + 30).toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <button className={styles.checkoutBtn}>Place Order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCart;
