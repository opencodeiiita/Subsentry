import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect database
connectDB();

// routes
app.use("/api/users", userRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Subsentry backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
