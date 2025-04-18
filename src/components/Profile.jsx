"use client";

import React, { useState } from "react";
import styles from "./Profile.module.css";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaRegUser,
} from "react-icons/fa";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "9123820593",
  });

  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([
    "123, Salt Lake, Kolkata - 700064",
    "56B, New Alipore, Kolkata - 700053",
  ]);

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const orders = [
    { id: "#12345", item: "Rohu Fish", date: "2025-04-10", status: "Delivered" },
    { id: "#12346", item: "Chicken Breast", date: "2025-04-08", status: "Out for Delivery" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved changes:", form); // Replace with actual API call
  };

  return (
    <div className={styles.container}>
      {/* Profile Info */}
      <div className={styles.profileCard}>
        <div className={styles.avatarIcon}>
          <FaRegUser />
        </div>

        {!isEditing ? (
          <>
            <h2>{form.name}</h2>
            <p>{form.email}</p>
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          </>
        ) : (
          <div className={styles.editForm}>
            <h3>Update Profile</h3>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <button className={styles.saveBtn} onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Order History */}
      <div className={styles.section}>
        <h3>🧾 Order History</h3>
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id}>
              <span>{order.item}</span>
              <span>{order.date}</span>
              <span className={styles.status}>{order.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Address Book */}
      <div className={styles.section}>
        <h3>📍 Address Book</h3>

        <button className={styles.addAddressBtn} onClick={() => setShowForm(true)}>
          Add Address
        </button>

        {showSuccessMessage && (
          <div className={styles.successMessage}>New address added!</div>
        )}

        {showForm && (
          <form
            className={styles.addressForm}
            onSubmit={(e) => {
              e.preventDefault();
              const newAddress = `${addressForm.address_line1}, ${addressForm.address_line2}, ${addressForm.address_line3}, ${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}`;
              const updatedAddresses = [...addresses, newAddress];
              setAddresses(updatedAddresses);

              const newIndex = updatedAddresses.length - 1;
              setHighlightedIndex(newIndex);
              setShowSuccessMessage(true);

              setAddressForm({
                name: "",
                phone: "",
                address_line1: "",
                address_line2: "",
                address_line3: "",
                city: "",
                state: "",
                pincode: "",
                is_default: false,
              });

              setShowForm(false);

              setTimeout(() => {
                setHighlightedIndex(null);
                setShowSuccessMessage(false);
              }, 3000);
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={addressForm.name}
              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address Line 1"
              value={addressForm.address_line1}
              onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={addressForm.address_line2}
              onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address Line 3"
              value={addressForm.address_line3}
              onChange={(e) => setAddressForm({ ...addressForm, address_line3: e.target.value })}
            />
            <input
              type="text"
              placeholder="City"
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="State"
              value={addressForm.state}
              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Pincode"
              value={addressForm.pincode}
              onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
              required
            />
            <label>
              <input
                type="checkbox"
                checked={addressForm.is_default}
                onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
              />
              Set as default address
            </label>
            <button type="submit" className={styles.saveBtn}>Save Address</button>
          </form>
        )}

        <ul className={styles.addressList}>
          {addresses.map((addr, idx) => (
            <li
              key={idx}
              className={idx === highlightedIndex ? styles.highlighted : ""}
            >
              <FaMapMarkerAlt className={styles.addrIcon} />
              {addr}
            </li>
          ))}
        </ul>
      </div>

      {/* Settings */}
      <div className={styles.section}>
        <h3>⚙️ Account Settings</h3>
        <button className={styles.logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
