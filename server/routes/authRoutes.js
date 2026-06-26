import express from "express";
import passport from "../config/passport.js";
import generateToken from "../utils/generateToken.js";

import {
    registerUser,
    loginUser,
    getProfile,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Manual auth ───────────────────────────────────────────────────────────────

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);

// ── Google OAuth ──────────────────────────────────────────────────────────────

// Step 1: redirect to Google consent screen
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

// Step 2: Google redirects back here after the user approves
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
    }),
    (req, res) => {
        // Issue a JWT and redirect to the frontend callback page
        const token = generateToken(req.user._id);

        const userData = encodeURIComponent(
            JSON.stringify({
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
            })
        );

        res.redirect(
            `${process.env.CLIENT_URL}/auth/google/success?token=${token}&user=${userData}`
        );
    }
);

export default router;
