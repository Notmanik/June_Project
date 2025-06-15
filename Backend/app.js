import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config' // Load environment variables from .env file
const app = express();
import connectDB from './config/Database.js';
import registerUser from './routes/auth/register.js';
import loginUser from './routes/auth/login.js';
import verifyToken from './config/auth.js';
// connoect to Mongo DB
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// register Route
app.post('/api/register', registerUser);
// login Route
app.post('/api/login', loginUser);
// Protected Route Example
app.get('/api/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: "This is a protected route", user: req.user });
});

// listening to the server
const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
