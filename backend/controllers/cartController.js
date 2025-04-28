// controllers/cartController.js
const pool = require("../config/db");

// ✅ Add or update item in cart
const addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: "Product ID and quantity are required" });
  }

  try {
    const existing = await pool.query(
      `SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2`,
      [userId, product_id]
    );

    if (existing.rowCount > 0) {
      await pool.query(
        `UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3`,
        [quantity, userId, product_id]
      );
    } else {
      await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [userId, product_id, quantity]
      );
    }

    res.json({ message: "Cart updated" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

// ✅ Get cart items
const getCartItems = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT 
        c.product_id AS id,
        c.quantity AS qty,
        p.name,
        p.sale_price AS price,
        p.image_url AS image
       FROM cart_items c
       JOIN cust_products p ON c.product_id = p.product_id
       WHERE c.user_id = $1`,
      [userId]
    );

    res.json({ items: result.rows });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Failed to get cart items" });
  }
};

// ✅ Remove item from cart
const removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const productId = parseInt(req.params.product_id);

  try {
    const result = await pool.query(
      `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};

// ✅ Checkout and place order
const placeOrder = async (req, res) => {
  const userId = req.user.userId;
  const {
    items, // [{ id, qty, price }]
    deliveryDate,
    deliverySlot,
    paymentMethod,
  } = req.body;

  try {
    const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

    const orderResult = await pool.query(
      `INSERT INTO cust_orders
        (user_id, total_price, address, status, slot_id, slot_date, payment_method, order_date)
       VALUES ($1, $2, 'N/A', 'Pending', 1, $3, $4, CURRENT_TIMESTAMP)
       RETURNING order_id`,
      [userId, total, deliveryDate, paymentMethod]
    );

    const orderId = orderResult.rows[0]?.order_id;
    if (!orderId) return res.status(500).json({ error: "Order creation failed" });

    for (const item of items) {
      await pool.query(
        `INSERT INTO cust_order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.qty, item.price]
      );
    }

    await pool.query(
      `INSERT INTO cust_payments (order_id, user_id, amount, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, 'Pending')`,
      [orderId, userId, total, paymentMethod]
    );

    await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

    res.json({ message: "Order placed successfully", order_id: orderId });
  } catch (err) {
    console.error("Cart Checkout Error:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  placeOrder,
};
