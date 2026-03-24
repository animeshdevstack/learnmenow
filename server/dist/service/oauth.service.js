"use strict";
/** @format */
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
exports.googleSignUpService = exports.googleSignInService = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const jwt_handler_1 = require("../helper/jwt-handler");
const googleSignInService = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    try {
        // Debug: Log profile structure
        console.log("Google profile received:", JSON.stringify(profile, null, 2));
        // Validate profile data with more flexible checks
        if (!profile) {
            throw new Error("Invalid Google profile: profile is null or undefined");
        }
        // Check for Google ID in different possible locations
        const googleId = profile.id || ((_a = profile._json) === null || _a === void 0 ? void 0 : _a.id) || ((_b = profile._json) === null || _b === void 0 ? void 0 : _b.sub);
        console.log("SIGNIN - Google ID found:", googleId);
        console.log("SIGNIN - Profile.id:", profile.id);
        console.log("SIGNIN - Profile._json?.id:", (_c = profile._json) === null || _c === void 0 ? void 0 : _c.id);
        console.log("SIGNIN - Profile._json?.sub:", (_d = profile._json) === null || _d === void 0 ? void 0 : _d.sub);
        if (!googleId) {
            console.error("SIGNIN - Profile structure:", profile);
            console.error("SIGNIN - Available profile keys:", Object.keys(profile));
            if (profile._json) {
                console.error("SIGNIN - Available _json keys:", Object.keys(profile._json));
            }
            throw new Error("Invalid Google profile: missing ID");
        }
        // Check for email in different possible locations
        const emails = profile.emails || ((_e = profile._json) === null || _e === void 0 ? void 0 : _e.emails) || [];
        const email = emails.length > 0 ? emails[0].value : (_f = profile._json) === null || _f === void 0 ? void 0 : _f.email;
        if (!email) {
            console.error("Profile emails structure:", profile.emails, (_g = profile._json) === null || _g === void 0 ? void 0 : _g.emails);
            throw new Error("Invalid Google profile: missing email");
        }
        // Check if user exists with this email
        let user = yield user_model_1.default.findOne({ Email: email });
        if (!user) {
            // Create new user with Google OAuth data
            const displayName = profile.displayName || ((_h = profile._json) === null || _h === void 0 ? void 0 : _h.name) || 'Google User';
            const nameParts = displayName.split(' ');
            const FName = nameParts[0] || 'Google';
            const LName = nameParts.slice(1).join(' ') || 'User';
            // Get avatar URL safely from different possible locations
            const photos = profile.photos || ((_j = profile._json) === null || _j === void 0 ? void 0 : _j.photos) || [];
            const avatarUrl = photos.length > 0 && ((_k = photos[0]) === null || _k === void 0 ? void 0 : _k.value)
                ? photos[0].value
                : ((_l = profile._json) === null || _l === void 0 ? void 0 : _l.picture) || '';
            user = new user_model_1.default({
                FName,
                LName,
                Email: email,
                // Phone and Password are optional for Google OAuth users
                Role: "User",
                IsVerified: true, // Google accounts are pre-verified
                GoogleId: googleId,
                Avatar: avatarUrl,
            });
            yield user.save();
        }
        else {
            // Update existing user with Google ID if not already set
            if (!user.GoogleId) {
                // Only update Google-specific fields, don't touch Phone or Password
                const updateData = {
                    GoogleId: googleId,
                };
                // Update avatar safely from different possible locations
                const photos = profile.photos || ((_m = profile._json) === null || _m === void 0 ? void 0 : _m.photos) || [];
                const avatarUrl = photos.length > 0 && ((_o = photos[0]) === null || _o === void 0 ? void 0 : _o.value)
                    ? photos[0].value
                    : ((_p = profile._json) === null || _p === void 0 ? void 0 : _p.picture) || user.Avatar;
                if (avatarUrl) {
                    updateData.Avatar = avatarUrl;
                }
                // Use findByIdAndUpdate to avoid validation issues
                yield user_model_1.default.findByIdAndUpdate(user._id, updateData, { new: true });
                user = yield user_model_1.default.findById(user._id);
            }
        }
        // Generate JWT token
        const token = (0, jwt_handler_1.generateToken)({
            id: user === null || user === void 0 ? void 0 : user._id,
            role: user === null || user === void 0 ? void 0 : user.Role,
            email: user === null || user === void 0 ? void 0 : user.Email
        }, "7d");
        return {
            User: {
                FName: (user === null || user === void 0 ? void 0 : user.FName) || undefined,
                LName: (user === null || user === void 0 ? void 0 : user.LName) || undefined,
                Phone: (user === null || user === void 0 ? void 0 : user.Phone) ? Number(user === null || user === void 0 ? void 0 : user.Phone) : undefined,
                Email: (user === null || user === void 0 ? void 0 : user.Email) || undefined,
                Role: (user === null || user === void 0 ? void 0 : user.Role) || undefined,
                IsVerified: (user === null || user === void 0 ? void 0 : user.IsVerified) || undefined,
                _id: ((_q = user === null || user === void 0 ? void 0 : user._id) === null || _q === void 0 ? void 0 : _q.toString()) || '',
            },
            Token: token,
        };
    }
    catch (error) {
        throw new Error(error.message || "Google sign-in failed");
    }
});
exports.googleSignInService = googleSignInService;
const googleSignUpService = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        // Debug: Log profile structure
        console.log("Google signup profile received:", JSON.stringify(profile, null, 2));
        // Validate profile data with more flexible checks
        if (!profile) {
            throw new Error("Invalid Google profile: profile is null or undefined");
        }
        // Check for Google ID in different possible locations
        const googleId = profile.id || ((_a = profile._json) === null || _a === void 0 ? void 0 : _a.id) || ((_b = profile._json) === null || _b === void 0 ? void 0 : _b.sub);
        console.log("SIGNUP - Google ID found:", googleId);
        console.log("SIGNUP - Profile.id:", profile.id);
        console.log("SIGNUP - Profile._json?.id:", (_c = profile._json) === null || _c === void 0 ? void 0 : _c.id);
        console.log("SIGNUP - Profile._json?.sub:", (_d = profile._json) === null || _d === void 0 ? void 0 : _d.sub);
        if (!googleId) {
            console.error("SIGNUP - Profile structure:", profile);
            console.error("SIGNUP - Available profile keys:", Object.keys(profile));
            if (profile._json) {
                console.error("SIGNUP - Available _json keys:", Object.keys(profile._json));
            }
            throw new Error("Invalid Google profile: missing ID");
        }
        // Check for email in different possible locations
        const emails = profile.emails || ((_e = profile._json) === null || _e === void 0 ? void 0 : _e.emails) || [];
        const email = emails.length > 0 ? emails[0].value : (_f = profile._json) === null || _f === void 0 ? void 0 : _f.email;
        if (!email) {
            console.error("Profile emails structure:", profile.emails, (_g = profile._json) === null || _g === void 0 ? void 0 : _g.emails);
            throw new Error("Invalid Google profile: missing email");
        }
        // Check if user already exists
        const existingUser = yield user_model_1.default.findOne({ Email: email });
        if (existingUser) {
            throw new Error("User already exists with this email. Please sign in instead.");
        }
        // Create new user with Google OAuth data
        const displayName = profile.displayName || ((_h = profile._json) === null || _h === void 0 ? void 0 : _h.name) || 'Google User';
        const nameParts = displayName.split(' ');
        const FName = nameParts[0] || 'Google';
        const LName = nameParts.slice(1).join(' ') || 'User';
        // Get avatar URL safely from different possible locations
        const photos = profile.photos || ((_j = profile._json) === null || _j === void 0 ? void 0 : _j.photos) || [];
        const avatarUrl = photos.length > 0 && ((_k = photos[0]) === null || _k === void 0 ? void 0 : _k.value)
            ? photos[0].value
            : ((_l = profile._json) === null || _l === void 0 ? void 0 : _l.picture) || '';
        const user = new user_model_1.default({
            FName,
            LName,
            Email: email,
            // Phone and Password are optional for Google OAuth users
            Role: "User",
            IsVerified: true, // Google accounts are pre-verified
            GoogleId: googleId,
            Avatar: avatarUrl,
        });
        yield user.save();
        // Generate JWT token
        const token = (0, jwt_handler_1.generateToken)({
            id: user._id,
            role: user.Role,
            email: user.Email
        }, "7d");
        return {
            User: {
                FName: user.FName || undefined,
                LName: user.LName || undefined,
                Phone: user.Phone ? Number(user.Phone) : undefined,
                Email: user.Email || undefined,
                Role: user.Role || undefined,
                IsVerified: user.IsVerified || undefined,
                _id: user._id.toString(),
            },
            Token: token,
        };
    }
    catch (error) {
        throw new Error(error.message || "Google sign-up failed");
    }
});
exports.googleSignUpService = googleSignUpService;
//# sourceMappingURL=oauth.service.js.map