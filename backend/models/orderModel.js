const pool = require('../config/db');

const getOrders = async () => {
  const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return result.rows;
};

const createOrder = async ({ product, quantity }) => {
  const result = await pool.query(
    'INSERT INTO orders (product, quantity) VALUES ($1, $2) RETURNING *',
    [product, quantity]
  );
  return result.rows[0];
};

module.exports = {
  getOrders,
  createOrder,
};
