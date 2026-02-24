import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    if (!mongoUri) {
      throw new Error("MONGO_URI is required in environment variables");
    }

    await mongoose.connect(mongoUri, {
      ...(dbName && { dbName }),
    });
    console.log(`MongoDB connected to database: ${dbName || "default"}`);
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

