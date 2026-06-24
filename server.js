require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
connectDB();

app.use('/auth', authRoutes);
app.use('/applications', applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});