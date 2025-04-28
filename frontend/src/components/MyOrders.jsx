//MyOrders.jsx

"use client";

import React, { useEffect, useState } from "react";
import styles from "./MyOrders.module.css";
import axios from "axios";
import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order, idx) => (
            <div key={order.order_id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <h2>Order {idx + 1}</h2>
                <p>{new Date(order.order_date).toLocaleDateString()}</p>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.leftCol}>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Payment Status:</strong> {order.payment_status}</p>
                  <p><strong>Payment Method:</strong> {order.payment_method}</p>
                  <p><strong>Order ID:</strong> {order.order_id}</p>
                  <p><strong>Delivery Date:</strong> {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : "N/A"}</p>
                  <p><strong>Delivery Time Slot:</strong> {order.slot_details || "N/A"}</p>
                </div>
                <div className={styles.rightCol}>
                  <p><strong>Total Paid:</strong> ₹{parseFloat(order.total).toFixed(2)}</p>
                </div>
              </div>

              {/* <button className={styles.detailsBtn} onClick={() => toggleDetails(order.order_id)}>
                {expandedOrderId === order.order_id ? "Hide Details" : "Order Details"}
              </button> */}

              {expandedOrderId === order.order_id && order.delivery_address && (
                <div className={styles.addressDetails}>
                  <h4>Delivery Address</h4>
                  <p>
                    {order.delivery_address.name}, {order.delivery_address.address_line1}, {order.delivery_address.address_line2}, {order.delivery_address.address_line3}, {order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}
                    <br />
                    📞 {order.delivery_address.phone}
                  </p>
                </div>
              )}

              <hr className={styles.divider} />

              <div className={styles.itemsWrapper}>
                {order.items?.map((item) => (
                  <div key={item.product_id} className={styles.itemRow}>
                    <img
                      src={item.image_url || "/placeholder.jpg"}
                      alt={item.name}
                      className={styles.productImage}
                    />
                    <div className={styles.itemInfo}>
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className={styles.price}>₹{parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
