const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Higher cost factor
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Include userId in token
    
    await pool.query('UPDATE users SET token = $1 WHERE id = $2', [token, result.rows[0].id]); // Save token in DB

    const user = result.rows[0];
    delete user.password; // Exclude hashed password from the response
    res.status(201).json({ user });
  } catch (error) {
    
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'An error occurred during registration. Please try again later.' });
  }
};

// Log in an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Updated to use email instead of username

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]); // Find user by email
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password); // Compare the hashed password

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate new token

    await pool.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.id]); // Update token in DB

    res.status(200).json({ token }); // Respond with token
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login. Please try again later.' });
  }
};

module.exports = { registerUser, loginUser };