import express from 'express';
import cors from 'cors';
import 'dotenv/config' 
const app = express();
app.use(cors()); 
import connectDB from './config/Database.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
// connoect to Mongo DB
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", postRoutes);

// listening to the server
const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
