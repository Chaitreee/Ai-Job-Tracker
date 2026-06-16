import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        let token;

        // Check if Authorization header exists
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            // Extract token
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database (exclude password)
            req.user = await User.findById(decoded.id).select("-password");

            return next();
        }

        return res.status(401).json({
            message: "Not authorized, no token",
        });
    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: "Not authorized, token failed",
        });
    }
};

export default protect;