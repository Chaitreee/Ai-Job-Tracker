import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import fs from "fs";
import os from "os";
import path from "path";
import { analyzeResume } from "../services/geminiService.js";

// Helper: upload a buffer to Cloudinary (wraps the stream API in a Promise)
const uploadBufferToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "resumes",
                resource_type: "raw", // PDFs are not images, so "raw"
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// @desc   Upload resume PDF to Cloudinary, save URL on user
// @route  POST /api/v1/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No resume uploaded",
            });
        }

        const result = await uploadBufferToCloudinary(req.file.buffer);

        const originalName = req.file.originalname;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                resumeUrl: result.secure_url,
                resumeName: originalName,
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Resume uploaded successfully",
            resumeUrl: user.resumeUrl,
            resumeName: user.resumeName,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// @desc   Match a job description against the user's saved resume
// @route  POST /api/v1/ai/match
export const matchResume = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription || jobDescription.trim().length === 0) {
            return res.status(400).json({
                message: "Job description is required",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user || !user.resumeUrl) {
            return res.status(400).json({
                message: "No resume uploaded yet. Please upload a resume first.",
            });
        }

        // Download the PDF bytes from Cloudinary
        const response = await fetch(user.resumeUrl);

        if (!response.ok) {
            return res.status(500).json({
                message: "Failed to fetch resume from storage",
            });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Gemini's SDK wants a file path, so write to a temp file
        const tempPath = path.join(os.tmpdir(), `resume-${Date.now()}.pdf`);
        fs.writeFileSync(tempPath, buffer);

        let analysis;
        try {
            analysis = await analyzeResume(tempPath, jobDescription);
        } finally {
            // Always clean up, even if Gemini throws
            fs.unlink(tempPath, () => {});
        }

        return res.status(200).json(analysis);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};