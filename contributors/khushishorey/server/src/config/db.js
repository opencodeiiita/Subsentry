import mongoose from  "mongoose"

const connectDB = async(req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected 🚀")
    } catch(error) {
    console.error("❌ Error connecting to MongoDB", error);
    process.exit(1);
    }
}

export default connectDB