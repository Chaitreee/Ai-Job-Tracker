import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // Optional — Google OAuth users don't have a password
        password: {
            type: String,
            minlength: 6,
            default: null,
        },

        // Set when the account was created or linked via Google OAuth
        googleId: {
            type: String,
            default: null,
        },

        resumeUrl: {
            type: String,
            default: null,
        },

        resumeName: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving — only when password is set and modified
userSchema.pre("save", async function () {
    if (!this.password || !this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
