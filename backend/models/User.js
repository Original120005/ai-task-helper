// models/User.js — схема для пользователей.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true  // Уникальный email.
  },
  password: { 
    type: String, 
    required: true  // Хэш bcrypt.
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);