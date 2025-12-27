import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/index.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});



connectDB()
    .then(() => {
        app.listen(process.env.PORT || 7000, () => {
            console.log(`server is running at port: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO_connection failed", err);
    })