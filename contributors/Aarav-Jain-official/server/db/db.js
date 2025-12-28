import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
    });

    console.log(`✅ MongoDB connected! DB Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error.message);
    process.exit(1);
  }
};

export default connectDB;
