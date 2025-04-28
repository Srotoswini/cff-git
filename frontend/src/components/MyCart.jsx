"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./MyCart.module.css";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const MyCart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState(2);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const deliverySlots = [
    { id: 1, label: "8:00 AM - 10:00 AM" },
    { id: 2, label: "10:00 AM - 12:00 PM" },
    { id: 3, label: "2:00 PM - 4:00 PM" },
    { id: 4, label: "6:00 PM - 8:00 PM" },
  ];

  useEffect(() => {
    fetchCartItems();
    fetchAddresses();

    const today = new Date();
    setSelectedDate(today.toISOString().split("T")[0]);
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart items:", err.message);
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/api/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
      const defaultAddress = res.data.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.address_id);
        setUserAddress(defaultAddress);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err.message);
    }
  };

  const getDateOptions = () => {
    const today = new Date();
    return Array.from({ length: 3 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date.toISOString().split("T")[0];
    });
  };

  const handleQtyChange = async (id, type) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, qty: type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1) } : item
    );
    setCartItems(updatedItems);

    try {
      const token = localStorage.getItem("token");
      const updatedItem = updatedItems.find((item) => item.id === id);
      await axios.post(`${baseUrl}/api/cart`, {
        product_id: id,
        quantity: updatedItem.qty,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Qty update failed:", err.message);
    }
  };

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Remove failed:", err.message);
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to place order.");
    if (!selectedAddressId) return alert("Please select a delivery address.");

    try {
      const payload = {
        items: cartItems.map((item) => ({
          id: item.id,
          qty: item.qty,
          price: item.price,
        })),
        address_id: selectedAddressId,
        slot_id: selectedSlotId,
        deliveryDate: selectedDate,
        paymentMethod,
      };

      const res = await axios.post(`${baseUrl}/api/cart/checkout`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Order Placed Successfully! ID: " + res.data.order_id);
      setCartItems([]);
      router.push("/myorders");
    } catch (err) {
      console.error("Place Order Error:", err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className={styles.container}>
      {cartItems.length === 0 ? (
        <p className={styles.empty}>Your cart is empty.</p>
      ) : (
        <>
          <div className={styles.cartList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.image} />
                <div className={styles.details}>
                  <h3>{item.name}</h3>
                  <div className={styles.qtyControl}>
                    <button onClick={() => handleQtyChange(item.id, "dec")}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => handleQtyChange(item.id, "inc")}>+</button>
                  </div>
                  <p className={styles.price}>₹{(item.price * item.qty).toFixed(2)}</p>
                </div>
                <button className={styles.removeBtn} onClick={() => handleRemove(item.id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.deliverySlot}>
              <h3>Delivery Details</h3>

              <label>
                Select Delivery Address
                <select
                  value={selectedAddressId || ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedAddressId(id);
                    setUserAddress(addresses.find(a => a.address_id === id));
                  }}
                  className={styles.select}
                >
                  <option value="" disabled>Select Address</option>
                  {addresses.map((addr) => (
                    <option key={addr.address_id} value={addr.address_id}>
                      {[addr.name, addr.address_line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Select Delivery Date
                <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className={styles.select}>
                  {getDateOptions().map((date, idx) => (
                    <option key={idx} value={date}>{date}</option>
                  ))}
                </select>
              </label>

              <label>
                Select Delivery Time Slot
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(Number(e.target.value))}
                  className={styles.select}
                >
                  {deliverySlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>{slot.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.paymentSection}>
              <h3>Select Payment Method</h3>
              <div className={styles.paymentOptions}>
                {["Cash on Delivery", "UPI", "Net Banking", "Credit/Debit Card"].map((method) => (
                  <label key={method}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    {method}
                  </label>
                ))}
              </div>

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

            <button className={styles.checkoutBtn} onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCart;
