import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import config from "../config.js"; // Import the correct config file
import jwt from "jsonwebtoken"; // Import JWT for token generation
import { z } from "zod"; // Import bcrypt for password hashing

export const signup = async (req, res) => {
    const { FirstName, LastName, Email, Password } = req.body;
    const userSchema = z.object({
        FirstName: z.string().min(1, "First name is required"),
        LastName: z.string().min(1, "Last name is required"),
        Email: z.string().email("Invalid email format"),
        Password: z.string().min(6, "Password must be at least 6 characters long"),
    });
const validationResult = userSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.error.issues.map(err=> err.message) });
    }

    // Check if the email already exists in the database



 const hashedPassword = await bcrypt.hash(Password, 10); // Hash the password before saving
    try {
        const existingUser = await User.findOne({ Email: Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            FirstName,
            LastName,
            Email,
            Password: hashedPassword, // Save the hashed password
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Error in signup" });
        console.log("Error in signup:", error);
    }
};
export const login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const user = await User.findOne({ Email: Email });
        if (!user) {
            return res.status(403).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(Password, user.Password); // Compare the hashed password
        if (!isPasswordValid) {
            return res.status(403).json({ error: "Invalid credentials" });
        }
       // Generate JWT token
       
        const token = jwt.sign(
            { id: user._id }, // Payload
            config.JWT_USER_PASSWORD, // Use the secret key from config.js
          {expiresIn:"1h"}// Optional: Set token expiration time
        );

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: "Error in login" });
        console.log("Error in login:", error);
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt"); // Corrected the typo from clearcokies to clearCookie
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: "Error in logout" });
        console.log("Error in logout:", error);
    }

};
