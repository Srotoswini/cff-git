// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  addToCart,
  getCartItems,
  placeOrder,
  removeFromCart
} = require('../controllers/cartController');

router.post('/', verifyToken, addToCart);             // Add or update item in cart
router.get('/', verifyToken, getCartItems);           // Get all cart items
router.delete('/:product_id', verifyToken, removeFromCart); // ❌ Remove specific item
router.post('/checkout', verifyToken, placeOrder);    // ✅ Checkout

module.exports = router;
