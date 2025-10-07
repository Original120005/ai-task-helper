const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3001' }));  // Для FE на 3001.
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Backend AI Task Helper running!'));
app.use('/tasks', require('./routes/tasks'));
app.use('/auth', require('./routes/auth'));
app.use('/ai', require('./routes/ai'));  // <-- Добавь эту строку для NLP!

// Mongo connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Mongo error:', err));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));