// routes/tasks.js — API for tasks (GET/POST/DELETE).
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// JWT middleware (protected).
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: new mongoose.Types.ObjectId(decoded.userId) };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid' });
  }
};

// GET /tasks — all tasks for user.
router.get('/', authMiddleware, async (req, res) => {
  console.log('GET /tasks hit, userId:', req.user.id);
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks — create task.
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

// DELETE /tasks/:id — delete task by ID.
router.delete('/:id', authMiddleware, async (req, res) => {
  console.log('DELETE /tasks/:id hit, id:', req.params.id, 'userId:', req.user.id);
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;  // Export for ai.js.