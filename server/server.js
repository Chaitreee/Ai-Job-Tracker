import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

//mounting routes
app.use("/api/v1/auth", authRoutes); // /v1 - API versioning
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/ai", aiRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server");
        console.error(error);
    }
};

startServer();