 import mongoose from "mongoose"; // Fixed typo in import
 
 const adminSchema = new mongoose.Schema({
     FirstName: {
         type: String,
         required: true,
     },
     LastName: {
         type: String,
         required: true,
     },
     Email: {
         type: String, // Changed from Number to String
         required: true,
         unique: true, // Ensures no duplicate emails
     },
     Password: {
         type: String,
         required: true,
     },
 });
 
 export const Admin = mongoose.model("admin", adminSchema); // Fixed typo in "mangoose"