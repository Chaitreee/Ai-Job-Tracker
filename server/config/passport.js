import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const name = profile.displayName;
                const googleId = profile.id;

                if (!email) {
                    return done(new Error("No email returned from Google"), null);
                }

                // Check if a user with this googleId already exists
                let user = await User.findOne({ googleId });

                if (!user) {
                    // Check if an account with this email already exists (manual signup)
                    user = await User.findOne({ email });

                    if (user) {
                        // Link the Google account to the existing user
                        user.googleId = googleId;
                        await user.save();
                    } else {
                        // Brand new user — create without a password
                        user = await User.create({ name, email, googleId });
                    }
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;
