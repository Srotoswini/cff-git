"use client";

import React, { useState } from "react";
import styles from "./Login.module.css";
import { FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ Import useRouter


const Login = () => {
  const [inputValue, setInputValue] = useState("");
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const router = useRouter(); // ✅ Initialize router
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const handleSendOTP = async () => {
    try {
      if (!inputValue) return alert("Please enter phone/email");

      const payload = loginWithEmail ? { email: inputValue } : { phone: inputValue };

      await axios.post(`${baseUrl}/api/otp/send-otp`, payload);
      setOtpSent(true);
      alert("OTP sent successfully!");
    } catch (err) {
      console.error("Send OTP error:", err);
      alert(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const payload = loginWithEmail
        ? { email: inputValue, otp_code: otp }
        : { phone: inputValue, otp_code: otp };

      const res = await axios.post(`${baseUrl}/api/otp/verify-otp`, payload);

      localStorage.setItem("token", res.data.token);
      alert("Login successful!");

      // ✅ Redirect to homepage
      router.push("/");
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert(err.response?.data?.error || "Failed to verify OTP");
    }
  };

  const toggleLoginMode = () => {
    setLoginWithEmail(!loginWithEmail);
    setInputValue("");
    setOtpSent(false);
    setOtp("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <h1 className={styles.welcome}>
          Welcome to <br />
          Calcutta Fresh Foods!
        </h1>

        <button className={styles.toggle} onClick={toggleLoginMode}>
          {loginWithEmail ? "Login With Phone" : "Login With Email"}
        </button>

        <input
          type={loginWithEmail ? "email" : "text"}
          placeholder={loginWithEmail ? "Enter your email" : "Enter phone number"}
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        {!otpSent ? (
          <button className={styles.loginBtn} onClick={handleSendOTP}>
            {loginWithEmail ? "Verify Email" : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className={styles.input}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className={styles.loginBtn} onClick={handleVerifyOTP}>
              Login
            </button>
          </>
        )}

        <div className={styles.orDivider}>
          <span>or</span>
        </div>

        <button className={styles.googleBtn}>
          <FcGoogle className={styles.googleIcon} />
          Sign in with Google
        </button>
      </div>

      <div className={styles.rightPanel}>
        <img src="/login-bg.png" alt="Seafood" className={styles.image} />
      </div>
    </div>
  );
};

export default Login;
