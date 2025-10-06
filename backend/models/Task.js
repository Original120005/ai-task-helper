// models/Task.js — схема для задач в MongoDB.
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true  // Обязательное поле (из NLP или input).
  },
  done: { 
    type: Boolean, 
    default: false  // По умолчанию не выполнена.
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Ссылка на User (для auth позже).
    required: true 
  },
  // Позже для NLP: dueDate: { type: Date }, priority: { type: String, enum: ['low', 'med', 'high'] }
}, { 
  timestamps: true  // Авто-поля: createdAt, updatedAt.
});

// Экспорт модели (Mongoose создаст коллекцию 'tasks').
module.exports = mongoose.model('Task', taskSchema);