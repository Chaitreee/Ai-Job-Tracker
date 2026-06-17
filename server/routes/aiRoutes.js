import express from "express";

import { uploadResume } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// POST /api/v1/ai/upload-resume
router.post(
    "/upload-resume",
    protect,
    upload.single("resume"),
    uploadResume
);

export default router;