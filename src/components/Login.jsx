"use client";

import React, { useState } from "react";
import styles from "./Login.module.css";
import { FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; // Import FcGoogle icon

const Login = () => {
  const [inputValue, setInputValue] = useState("");
  const [loginWithEmail, setLoginWithEmail] = useState(false); // track input mode

  const handleSendOTP = () => {
    console.log("Sending to", inputValue);
  };

  const toggleLoginMode = () => {
    setLoginWithEmail(!loginWithEmail);
    setInputValue(""); // clear field on toggle (optional)
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
          placeholder={loginWithEmail ? "Enter your email" : "Enter phone number"} // Updated placeholder
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button className={styles.loginBtn} onClick={handleSendOTP}>
          {loginWithEmail ? "Verify Email" : "Send OTP"} 
        </button>

        <div className={styles.orDivider}>
          <span>or</span>
        </div>

        <button className={styles.googleBtn}>
          <FcGoogle className={styles.googleIcon} /> {/* Using FcGoogle icon */}
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
