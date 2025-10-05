const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (пока заглушки)
app.get('/', (req, res) => res.send('Backend AI Task Helper running!'));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Mongo error:', err));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));