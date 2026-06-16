import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc Register a new user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        // Compare password
        if (user && (await user.comparePassword(password))) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }

        return res.status(401).json({
            message: "Invalid email or password",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


// @desc Get current logged-in user
// @route GET /api/v1/auth/me
export const getProfile = async (req, res) => {
    return res.status(200).json(req.user);
};