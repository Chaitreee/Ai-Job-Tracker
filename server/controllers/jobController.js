import mongoose from "mongoose";
import Job from "../models/Job.js";

// @desc Create a new job
// @route POST /api/v1/jobs
export const createJob = async (req, res) => {
    try {
        const {
            company,
            role,
            jobLink,
            deadline,
            notes,
        } = req.body;

        // Validate required fields
        if (!company || !role) {
            return res.status(400).json({
                message: "Company and role are required",
            });
        }

        // Create job
        const job = await Job.create({
            user: req.user._id,
            company,
            role,
            jobLink,
            deadline,
            notes,
        });

        return res.status(201).json(job);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// @desc Get all jobs for logged-in user
// @route GET /api/v1/jobs
export const getJobs = async (req, res) => {
    try {

        const {
            status,
            search,
            sort,
        } = req.query;

        // Base query (always filter by logged-in user)
        const query = {
            user: req.user._id,
        };

        // Status filter
        if (status && status !== "All") {
            query.status = status;
        }

        // Search by company or role
        if (search?.trim()) {
            const searchTerm = search.trim();

            query.$or = [
                {
                    company: {
                        $regex: searchTerm,
                        $options: "i",
                    },
                },
                {
                    role: {
                        $regex: searchTerm,
                        $options: "i",
                    },
                },
            ];
        }

        // Sorting
        let sortOption = {
            createdAt: -1,
        };

        if (sort === "oldest") {
            sortOption = {
                createdAt: 1,
            };
        }

        const jobs = await Job.find(query).sort(sortOption);

        return res.status(200).json(jobs);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// @desc Update a job
// @route PUT /api/v1/jobs/:id
export const updateJob = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);

        // Check if job exists
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Check ownership
        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this job",
            });
        }

        const {
            company,
            role,
            jobLink,
            status,
            deadline,
            notes,
            interviewExperience,
        } = req.body;

        // Store old status
        const oldStatus = job.status;

        // Update fields only if provided
        job.company = company ?? job.company;
        job.role = role ?? job.role;
        job.jobLink = jobLink ?? job.jobLink;
        job.status = status ?? job.status;
        job.deadline = deadline ?? job.deadline;
        job.notes = notes ?? job.notes;
        job.interviewExperience =
            interviewExperience ?? job.interviewExperience;

        // If status changed, add timeline event
        if (oldStatus !== job.status) {
            job.timeline.push({
                event: `Moved to ${job.status}`,
                date: new Date(),
            });
        }

        await job.save();

        return res.status(200).json(job);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// @desc Delete a job
// @route DELETE /api/v1/jobs/:id
export const deleteJob = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);

        // Check if job exists
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Check ownership
        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this job",
            });
        }

        await job.deleteOne();

        return res.status(200).json({
            message: "Job deleted successfully",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// @desc Get dashboard statistics
// @route GET /api/v1/jobs/stats
export const getJobStats = async (req, res) => {
    try {

        const stats = await Job.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user._id),
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        // Default counts
        const result = {
            totalJobs: 0,
            Applied: 0,
            OA: 0,
            Interview: 0,
            Offer: 0,
            Rejected: 0,
        };

        // Fill counts
        stats.forEach((item) => {

            result[item._id] = item.count;
            result.totalJobs += item.count;

        });

        return res.status(200).json(result);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};