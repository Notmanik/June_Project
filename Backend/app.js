import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config' // Load environment variables from .env file
const app = express();
import connectDB from './config/Database.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
// connoect to Mongo DB
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api", postRoutes);

// listening to the server
const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
