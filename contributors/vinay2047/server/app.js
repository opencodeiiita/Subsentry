import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT=process.env.PORT || 3000;

dotenv.config();

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
