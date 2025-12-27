import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    catch (e) {
        console.error("MongoDB connection failed:", e.message);
        process.exit(1); // Exit app if DB fails
    }
};