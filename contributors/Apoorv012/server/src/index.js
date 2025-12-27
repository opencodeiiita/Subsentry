import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from "./config/db.js";
import mongoose from 'mongoose';

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/health/db', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    ok: isConnected,
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
