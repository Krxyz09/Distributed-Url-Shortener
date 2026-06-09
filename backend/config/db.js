import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env and paste your Atlas string.");
  }
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
};
