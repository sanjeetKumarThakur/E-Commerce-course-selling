  import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import config from "../config.js"; // Import the correct config file
import jwt from "jsonwebtoken"; // Import JWT for token generation
import { z } from "zod"; 
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js"; // Import the Course model

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
        res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        res.status(500).json({ error: "Error in signup" });
        console.log("Error in signup:", error);
    }
};
export const login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ Email: Email });
        if (!user) {
            return res.status(403).json({ error: "Invalid credentials" });
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(403).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id }, // Payload
            config.JWT_USER_PASSWORD, // Secret key from config.js
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
        res.status(200).json({ message: "Login successful", user, token });
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

 
export const purchases= async(req,res)=>{
    const userId=req.userId;
    try{
        const purchased=await Purchase.find({userId})
        let purcheasedCourseId=[]
        for(let i=0;i<purchased.length;i++){
            purcheasedCourseId.push(purchased[i].courseId)
           
        }
        const courseData=await Course.find({_id:{$in:purcheasedId},})
        res.status(200).json({purchased,courseData});


    }catch(error){
        res.status(500).json({error:"Error in purchase"});
        console.log("Error in purchase:",error);

    }

}
