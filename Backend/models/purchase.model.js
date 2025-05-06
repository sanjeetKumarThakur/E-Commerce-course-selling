import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        ref: "User", // Optional: Reference to the User model
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Course model
        required: true,
        ref: "Course", // Optional: Reference to the Course model
    },
    purchaseDate: {
        type: Date,
        default: Date.now, // Automatically set the purchase date
    },
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);