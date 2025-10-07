// routes/auth.js — auth API: POST /register, POST /login, GET /verify.
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Импорт authMiddleware из tasks.js (для /verify).
const { authMiddleware } = require('./tasks');

// POST /register — create user.
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email } });
  } catch (err) {
    if (err.code === 11000) res.status(400).json({ error: 'Email already exists' });
    else res.status(500).json({ error: err.message });
  }
});

// POST /login — login.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /verify — check token (returns user if valid).
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ user: { id: req.user.id, email: 'from DB' } });  // Later populate from User model.
});

module.exports = router;