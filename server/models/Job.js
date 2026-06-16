import mongoose from "mongoose";

// Timeline sub-schema
const timelineSchema = new mongoose.Schema(
    {
        event: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

// Main Job schema
const jobSchema = new mongoose.Schema(
    {
        // Owner of the job application
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Company name
        company: {
            type: String,
            required: true,
            trim: true,
        },

        // Job role
        role: {
            type: String,
            required: true,
            trim: true,
        },

        // Link to the job posting
        jobLink: {
            type: String,
            trim: true,
            default: "",
        },

        // Current status of the application
        status: {
            type: String,
            enum: [
                "Applied",
                "OA",
                "Interview",
                "Offer",
                "Rejected",
            ],
            default: "Applied",
        },

        // Deadline for the application/interview/etc.
        deadline: {
            type: Date,
        },

        // General notes
        notes: {
            type: String,
            default: "",
        },

        // Interview experience journal
        interviewExperience: {
            type: String,
            default: "",
        },

        // Timeline of events
        timeline: {
            type: [timelineSchema],
            default: () => [
                {
                    event: "Applied",
                    date: new Date(),
                },
            ],
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;