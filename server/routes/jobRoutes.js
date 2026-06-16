import express from "express";

import {
    createJob,
    getJobs,
    updateJob,
    deleteJob,
} from "../controllers/jobController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new job
router.post("/", protect, createJob);

// Get all jobs of logged-in user
router.get("/", protect, getJobs);

// Update a job
router.put("/:id", protect, updateJob);

// Delete a job
router.delete("/:id", protect, deleteJob);

export default router;