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
    res.json({ message: "Server is running successfully!" });
});

// Mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/ai", aiRoutes);

// 404 handler — catches requests to routes that don't exist
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler — catches any error passed via next(err) or unhandled throws
// Must have 4 parameters so Express recognises it as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);

    // Multer file size / type errors
    if (err.name === "MulterError") {
        return res.status(400).json({ message: err.message });
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages.join(", ") });
    }

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
    }

    const statusCode = err.statusCode || err.status || 500;
    const message =
        process.env.NODE_ENV === "production"
            ? "Something went wrong. Please try again later."
            : err.message || "Internal Server Error";

    res.status(statusCode).json({ message });
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();