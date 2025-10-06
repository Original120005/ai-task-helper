// routes/tasks.js — добавь jwt.verify в middleware.
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// JWT middleware (protected).
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Из headers.
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: new mongoose.Types.ObjectId(decoded.userId) };  // userId из token.
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid' });
  }
};

// GET /tasks (protected).
router.get('/', authMiddleware, async (req, res) => {
  console.log('GET /tasks hit, userId:', req.user.id);
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks (protected).
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /tasks hit, body:', req.body);
  try {
    const newTask = new Task({ ...req.body, userId: req.user.id });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;