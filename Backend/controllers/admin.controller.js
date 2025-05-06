
import bcrypt from "bcryptjs";
import config from "../config.js"; // Import the correct config file
import jwt from "jsonwebtoken"; // Import JWT for token generation
import { z } from "zod"; 
import { Admin } from "../models/admin.model.js"; // Import the Course model
 export const signup = async (req, res) => {
     const { FirstName, LastName, Email, Password } = req.body;

     const adminSchema = z.object({
         FirstName: z.string().min(1, "First name is required"),
         LastName: z.string().min(1, "Last name is required"),
         Email: z.string().email("Invalid email format"),
         Password: z.string().min(6, "Password must be at least 6 characters long"),
     });
 const validationResult = adminSchema.safeParse(req.body);
     if (!validationResult.success) {
         return res.status(400).json({ errors: validationResult.error.issues.map(err=> err.message) });
     }
 
  
 
 
  const hashedPassword = await bcrypt.hash(Password, 10); // Hash the password before saving
     try {
         const existingAdmin = await Admin.findOne({ Email: Email });
         if (existingAdmin) {
             return res.status(400).json({ message: "Admin already exists" });
         }
 
         const newAdmin = new Admin({
             FirstName,
             LastName,
             Email,
             Password: hashedPassword, // Save the hashed password
         });
 
         await newAdmin.save();
         res.status(201).json({ message: " Signup successfully", newAdmin });
     } catch (error) {
         res.status(500).json({ error: "Error in signup" });
         console.log("Error in signup:", error);
     }
 };
export const login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        // Find the admin by email
        const admin = await Admin.findOne({ Email: Email });
        if (!admin) {
            return res.status(403).json({ error: "Invalid credentials" });
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(Password, admin.Password);
        if (!isPasswordValid) {
            return res.status(403).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id }, // Payload
            config.JWT_ADMIN_PASSWORD, // Secret key from config.js
            { expiresIn: "1d" } // Token expiration time
        );

        // Set the token as a cookie
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day in milliseconds
            httpOnly: true, // Can't be accessed via JavaScript
            secure: process.env.NODE_ENV === "production", // Set to true in production
            sameSite: "Strict", // CSRF attack prevention
        };
        res.cookie("jwt", token, cookieOptions);

        // Respond with success
        res.status(200).json({ message: "Login successful", admin, token });
    } catch (error) {
        res.status(500).json({ error: "Error in login" });
        console.log("Error in login:", error);
    }
};
 export const logout = async (req, res) => {
     try {
        if(!req.cookies.jwt){
                return res.status(400).json({error:"kindly login first"});
        }
         res.clearCookie("jwt"); // Corrected the typo from clearcokies to clearCookie
         res.status(200).json({ message: "Logout successful" });
      } catch (error) {
         res.status(500).json({ error: "Error in logout" });
         console.log("Error in logout:", error);
     }
 
 };
 