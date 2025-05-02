import express from "express";
import mongoose from "mongoose";
import { connectDatabase } from "./db/connect.js"; // Updated to use import
import dotenv from "dotenv";
import CourseRoute from "./routes/course.route.js";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Database connection
connectDatabase();

// Course routes
app.use("/api/v1/Course", CourseRoute);
//cloudeinary configuration code
cloudinary.config({ 
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// Fallback route for unhandled routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});