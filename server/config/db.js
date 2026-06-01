import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async() => {
    if (!process.env.MONGO_URI) {
        console.error("❌ Error: MONGO_URI is missing in .env file");
        process.exit(1);
    }
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("🎊 Database Connected");
    } catch (error) {
        console.error("Connection Error : ",error.message);
        process.exit(1);
    }
}; 

