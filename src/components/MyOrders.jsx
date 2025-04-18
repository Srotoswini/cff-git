"use client";

import React, { useState } from "react";
import styles from "./MyOrders.module.css";
import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkedAlt,
} from "react-icons/fa";
import ProductSection from "./ProductSection"; // 🔁 Update path as needed

const MyOrders = () => {
  const [showMap, setShowMap] = useState(false);
  const [riderLocation, setRiderLocation] = useState({ lat: 0, lng: 0 });

  const orders = [
    {
      id: "#ORD12345",
      item: "Premium Rohu Fish (1.5kg)",
      date: "2025-04-10",
      status: "Delivered",
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      price: "₹699.00",
      totalPaid: "₹699.00",
      qty: 1,
      image: "/fish.png",
    },
    {
      id: "#ORD12346",
      item: "Chicken Breast Boneless (500g)",
      date: "2025-04-12",
      status: "Out for Delivery",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      price: "₹299.00",
      totalPaid: "₹598.00",
      qty: 2,
      image: "/meat.jpg",
    },
    {
      id: "#ORD12347",
      item: "Fresh Telapia Fish (1kg)",
      date: "2025-04-14",
      status: "Cancelled",
      paymentMethod: "Card",
      paymentStatus: "Refunded",
      price: "₹1,099.00",
      totalPaid: "₹0.00",
      qty: 1,
      image: "/fish2.jpg",
    },
  ];

  const topOffers = [
    {
      id: "p1",
      name: "Premium Rohu Fish (1kg)",
      price: "₹899",
      originalPrice: "₹1099",
      image: "/fish.png",
    },
    {
      id: "p2",
      name: "Chicken Drumsticks (1kg)",
      price: "₹449",
      originalPrice: "₹599",
      image: "/meat.jpg",
    },
    {
      id: "p3",
      name: "Prawns Medium (500g)",
      price: "₹399",
      originalPrice: "₹499",
      image: "/fish3.jpg",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FaCheckCircle className={styles.delivered} />;
      case "Out for Delivery":
        return <FaTruck className={styles.outForDelivery} />;
      case "Cancelled":
        return <FaTimesCircle className={styles.cancelled} />;
      default:
        return <FaBoxOpen />;
    }
  };

  const handleTrackClick = () => {
    setRiderLocation({ lat: 22.5726, lng: 88.3639 });
    setShowMap(!showMap);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>    </h1>
      <div className={styles.orderList}>
        {orders.map((order, idx) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <h2>Order {idx + 1}</h2>
              <p>{order.date}</p>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.leftCol}>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`${styles.statusBadge} ${styles[order.status.replace(/ /g, "").toLowerCase()]}`}
                  >
                    {order.status}
                  </span>
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span className={styles.paymentStatus}>{order.paymentStatus}</span>
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  <span className={styles.paymentMethod}>{order.paymentMethod}</span>
                </p>
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
              </div>
              <div className={styles.rightCol}>
                <p>
                  <strong>Total Paid:</strong> {order.totalPaid}
                </p>
              </div>
            </div>

            <hr />

            <div className={styles.itemRow}>
              <img src={order.image} alt={order.item} className={styles.productImage} />
              <div className={styles.itemInfo}>
                <h4>{order.item}</h4>
                <p>Qty: {order.qty}</p>
                <p className={styles.price}>{order.price}</p>
              </div>
            </div>

            
          </div>
        ))}
      </div>

      

      {/* 🔥 Top Offers Section */}
      <ProductSection
        title="Top Offers for You"
        viewAllLink="/offers"
        products={topOffers}
      />
    </div>
  );
};

export default MyOrders;
