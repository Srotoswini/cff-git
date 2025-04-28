//this is my profile.jsx component

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Profile.module.css";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaRegUser,
  FaTrashAlt,
  FaCheck,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const Profile = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    second_address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
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

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          second_address: res.data.second_address || "",
          city: res.data.city || "",
          state: res.data.state || "",
          pincode: res.data.pincode || "",
        });
      } catch (err) {
        console.error("Fetch profile error:", err);
        alert("Session expired or unauthorized. Please login again.");
        logout();
        router.push("/login");
      }
    };

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/users/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(res.data);
      } catch (err) {
        console.error("Fetch address error:", err);
      }
    };

    fetchProfile();
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`${baseUrl}/api/users/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated!");
      setForm(res.data.user);
      setIsEditing(false);

      // ✅ Also add profile info as address
      const addressData = {
        name: res.data.user.name,
        phone: res.data.user.phone,
        address_line1: res.data.user.address,
        address_line2: res.data.user.second_address,
        address_line3: "",
        city: res.data.user.city,
        state: res.data.user.state,
        pincode: res.data.user.pincode,
        is_default: false,
      };
      await axios.post(`${baseUrl}/api/users/addresses`, addressData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const refreshed = await axios.get(`${baseUrl}/api/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(refreshed.data);
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    logout();
    alert("You have been logged out.");
    router.push("/");
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const hasDefault = addresses.some((a) => a.is_default);
    if (hasDefault && addressForm.is_default) {
      alert("Only one default address allowed.");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/api/users/addresses`, addressForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses((prev) => [...prev, res.data]);
      setHighlightedIndex(addresses.length);
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
    } catch (err) {
      console.error("Add address error:", err);
      alert("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${baseUrl}/api/users/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addresses.filter((addr) => addr.address_id !== addressId));
    } catch (err) {
      console.error("Delete address error:", err);
      alert("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${baseUrl}/api/users/addresses/${addressId}`, { is_default: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`${baseUrl}/api/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
    } catch (err) {
      console.error("Set default address error:", err);
      alert("Failed to set default address");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatarIcon}><FaRegUser /></div>
        {!isEditing ? (
          <>
            <h2>{form.name}</h2>
            <p>{form.email}</p>
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}><FaEdit /> Edit Profile</button>
          </>
        ) : (
          <div className={styles.editForm}>
            <h3>Update Profile</h3>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
            <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" />
            <input type="text" name="second_address" value={form.second_address} onChange={handleChange} placeholder="Address Line 2" />
            <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" />
            <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="State" />
            <input type="text" name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" />
            <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3>📍 Address Book</h3>
        <button className={styles.addAddressBtn} onClick={() => setShowForm(true)}>Add Address</button>
        {showSuccessMessage && <div className={styles.successMessage}>New address added!</div>}

        {showForm && (
          <form className={styles.addressForm} onSubmit={handleAddressSubmit}>
            <input type="text" placeholder="Full Name" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} required />
            <input type="tel" placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} required />
            <input type="text" placeholder="Address Line 1" value={addressForm.address_line1} onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })} required />
            <input type="text" placeholder="Address Line 2" value={addressForm.address_line2} onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })} />
            <input type="text" placeholder="Address Line 3" value={addressForm.address_line3} onChange={(e) => setAddressForm({ ...addressForm, address_line3: e.target.value })} />
            <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required />
            <input type="text" placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} required />
            <input type="text" placeholder="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} required />
            <label>
              <input type="checkbox" checked={addressForm.is_default} onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })} />
              Set as default address
            </label>
            <button type="submit" className={styles.saveBtn}>Save Address</button>
          </form>
        )}

<ul className={styles.addressList}>
  {addresses.map((addr) => (
    <li key={addr.address_id} className={addr.is_default ? styles.highlighted : ""}>
      <FaMapMarkerAlt className={styles.addrIcon} />
      <div>
        <strong>{addr.name}</strong><br />
        {[addr.address_line1, addr.address_line2, addr.address_line3, addr.city, addr.state, addr.pincode]
          .filter(Boolean)
          .join(", ")}
      </div>
      <div className={styles.addressActions}>
        {!addr.is_default && (
          <button onClick={() => handleSetDefault(addr.address_id)} title="Set as Default"><FaCheck /></button>
        )}
        <button onClick={() => handleDeleteAddress(addr.address_id)} title="Delete"><FaTrashAlt /></button>
      </div>
    </li>
  ))}
</ul>

      </div>

      <div className={styles.section}>
        <h3>⚙️ Account Settings</h3>
        <button className={styles.logout} onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </div>
    </div>
  );
};

export default Profile;