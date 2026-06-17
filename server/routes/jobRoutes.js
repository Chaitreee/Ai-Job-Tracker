import express from "express";

import {
    createJob,
    getJobs,
    updateJob,
    deleteJob,
    getJobStats,
} from "../controllers/jobController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new job
router.post("/", protect, createJob);

// Get all jobs of logged-in user
router.get("/", protect, getJobs);

// Get job stats for dashboard
router.get("/stats", protect, getJobStats);

// Update a job
router.put("/:id", protect, updateJob);

// Delete a job
router.delete("/:id", protect, deleteJob);

export default router;