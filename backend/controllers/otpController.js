const db = require('../config/db'); // ✅ db is the connection pool
const jwt = require('jsonwebtoken');

// Step 1: Send OTP
const sendOtp = async (req, res) => {
  const { phone, email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    if (!phone && !email) {
      return res.status(400).json({ error: 'Phone or Email is required' });
    }

    await db.query(
      'INSERT INTO otps (phone, email, otp_code, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
      [phone || null, email || null, otp]
    );

    console.log(`✅ OTP sent to ${phone || email}: ${otp}`);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Step 2: Verify OTP
const verifyOtp = async (req, res) => {
  const { phone, email, otp_code } = req.body;

  try {
    console.log("Verifying OTP for:", { phone, email, otp_code });

    let result;

    if (phone) {
      result = await db.query(
        `SELECT * FROM otps
         WHERE otp_code = $1 AND phone = $2
         AND created_at > NOW() - INTERVAL '5 minutes'
         ORDER BY created_at DESC LIMIT 1`,
        [otp_code, phone]
      );
    } else if (email) {
      result = await db.query(
        `SELECT * FROM otps
         WHERE otp_code = $1 AND email = $2
         AND created_at > NOW() - INTERVAL '5 minutes'
         ORDER BY created_at DESC LIMIT 1`,
        [otp_code, email]
      );
    } else {
      return res.status(400).json({ error: 'Phone or Email is required' });
    }

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Clean up OTPs
    await db.query('DELETE FROM otps WHERE phone = $1 OR email = $2', [phone || null, email || null]);

    // Fetch or create user
    let user;
    if (phone) {
      const userQuery = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
      user = userQuery.rows[0];
    } else if (email) {
      const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      user = userQuery.rows[0];
    }

    if (!user) {
      const insertQuery = phone
        ? await db.query(
            'INSERT INTO users (phone, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [phone, 'New User', email || `${phone}@otp.com`, 'OTP_AUTH']
          )
        : await db.query(
            'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [email, 'New User', 'OTP_AUTH']
          );
      user = insertQuery.rows[0];
    }

    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Step 3: Fetch user details
const details = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Decoded JWT user:", req.user);
    res.json({
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      city: user.city,
      pincode: user.pincode,
    });
  } catch (err) {
    console.error("User details error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

module.exports = { sendOtp, verifyOtp, details };
