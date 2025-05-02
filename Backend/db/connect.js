import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI); // Removed deprecated options
    console.log("Database connection successful:");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

