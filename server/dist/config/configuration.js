"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const configuration = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    MONGO_URI: process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost:27017/learnMeNow",
    BASE_URL: process.env.BASE_URL ? (process.env.BASE_URL) : "/v1/api",
    JWT_SECRET: process.env.JWT_SECRET ? (process.env.JWT_SECRET) : "secret",
    FRONTEND_URL: process.env.FRONTEND_URL ? (process.env.FRONTEND_URL) : "http://localhost:5173",
    ADMIN_GMAIL_ACCOUNT: process.env.ADMIN_GMAIL_ACCOUNT ? (process.env.ADMIN_GMAIL_ACCOUNT) : "admin@gmail.com",
    ADMIN_GMAIL_PASSWORD: process.env.ADMIN_GMAIL_PASSWORD ? (process.env.ADMIN_GMAIL_PASSWORD) : "admin123",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? (process.env.GOOGLE_CLIENT_ID) : "google_client_id",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? (process.env.GOOGLE_CLIENT_SECRET) : "google_client_secret",
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL ? (process.env.GOOGLE_CALLBACK_URL) : "http://localhost:8080/oauth/google/callback",
    GOOGLE_SIGNUP_CALLBACK_URL: process.env.GOOGLE_SIGNUP_CALLBACK_URL ? (process.env.GOOGLE_SIGNUP_CALLBACK_URL) : "http://localhost:8080/oauth/google/signup/callback",
};
exports.default = configuration;
//# sourceMappingURL=configuration.js.map