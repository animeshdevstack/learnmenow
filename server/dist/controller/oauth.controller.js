"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleSignUpCallback = exports.googleSignUp = exports.googleCallback = exports.googleAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const configuration_1 = __importDefault(require("../config/configuration"));
const oauth_service_1 = require("../service/oauth.service");
// Helper function to construct frontend URL without double slashes
const getFrontendUrl = (path, params) => {
    const baseUrl = configuration_1.default.FRONTEND_URL.endsWith('/')
        ? configuration_1.default.FRONTEND_URL.slice(0, -1)
        : configuration_1.default.FRONTEND_URL;
    const url = `${baseUrl}${path}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        return `${url}?${searchParams.toString()}`;
    }
    return url;
};
// Configure Google OAuth Strategy for Sign-in
passport_1.default.use('google-signin', new passport_google_oauth20_1.Strategy({
    clientID: configuration_1.default.GOOGLE_CLIENT_ID,
    clientSecret: configuration_1.default.GOOGLE_CLIENT_SECRET,
    callbackURL: configuration_1.default.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Debug: Log the profile structure
        console.log("Passport signin profile:", JSON.stringify(profile, null, 2));
        // Use the OAuth service to handle user creation/authentication
        const result = yield (0, oauth_service_1.googleSignInService)(profile);
        return done(null, result);
    }
    catch (err) {
        console.error("Passport signin error:", err.message);
        done(err, null);
    }
})));
// Configure Google OAuth Strategy for Sign-up
passport_1.default.use('google-signup', new passport_google_oauth20_1.Strategy({
    clientID: configuration_1.default.GOOGLE_CLIENT_ID,
    clientSecret: configuration_1.default.GOOGLE_CLIENT_SECRET,
    callbackURL: configuration_1.default.GOOGLE_SIGNUP_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Debug: Log the profile structure
        console.log("Passport signup profile:", JSON.stringify(profile, null, 2));
        // Use the OAuth service to handle user creation/authentication
        const result = yield (0, oauth_service_1.googleSignUpService)(profile);
        return done(null, result);
    }
    catch (err) {
        console.error("Passport signup error:", err.message);
        done(err, null);
    }
})));
passport_1.default.serializeUser((user, done) => done(null, user));
passport_1.default.deserializeUser((obj, done) => done(null, obj));
// Google OAuth initiation
const googleAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.authenticate("google-signin", { scope: ["profile", "email"] })(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.googleAuth = googleAuth;
// Google OAuth callback
const googleCallback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.authenticate("google-signin", (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                const redirectUrl = getFrontendUrl('/user/oauth/callback', {
                    success: 'false',
                    error: err.message
                });
                return res.redirect(redirectUrl);
            }
            if (!result) {
                const redirectUrl = getFrontendUrl('/user/oauth/callback', {
                    success: 'false',
                    error: 'Authentication failed'
                });
                return res.redirect(redirectUrl);
            }
            // Redirect to frontend with token
            const redirectUrl = getFrontendUrl('/user/oauth/callback', {
                token: result.Token,
                success: 'true'
            });
            return res.redirect(redirectUrl);
        }))(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.googleCallback = googleCallback;
// Google Sign Up initiation
const googleSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.authenticate("google-signup", {
            scope: ["profile", "email"]
        })(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.googleSignUp = googleSignUp;
// Google Sign Up callback
const googleSignUpCallback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.authenticate("google-signup", (err, profile) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                const redirectUrl = getFrontendUrl('/user/oauth/callback', {
                    success: 'false',
                    error: err.message
                });
                return res.redirect(redirectUrl);
            }
            if (!profile) {
                const redirectUrl = getFrontendUrl('/user/oauth/callback', {
                    success: 'false',
                    error: 'Authentication failed'
                });
                return res.redirect(redirectUrl);
            }
            try {
                // The profile is already the result from the Passport strategy
                // No need to call googleSignUpService again
                const redirectUrl = getFrontendUrl('/user/oauth/callback', {
                    token: profile.Token,
                    success: 'true',
                    action: 'signup'
                });
                return res.redirect(redirectUrl);
            }
            catch (signupError) {
                const redirectUrl = getFrontendUrl('/user/oauth/callback', {
                    success: 'false',
                    error: signupError.message
                });
                return res.redirect(redirectUrl);
            }
        }))(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.googleSignUpCallback = googleSignUpCallback;
//# sourceMappingURL=oauth.controller.js.map