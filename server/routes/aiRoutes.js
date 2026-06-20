import express from "express";

import { uploadResume, matchResume } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload-resume", protect, upload.single("resume"), uploadResume);
router.post("/match", protect, matchResume);

export default router;