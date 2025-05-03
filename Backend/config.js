import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

export default {
    JWT_USER_PASSWORD,
};