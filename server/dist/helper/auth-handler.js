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
exports.authMiddleware = exports.adminMiddleware = void 0;
const configuration_1 = __importDefault(require("../config/configuration"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First authenticate the user
        yield (0, exports.authMiddleware)(req, res, (err) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication failed",
                });
            }
        });
        // Then check if user has admin role
        const decode = req.user;
        if (!decode || decode.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden - Admin access required",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error during authorization",
        });
    }
});
exports.adminMiddleware = adminMiddleware;
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        const token = typeof authHeader === "string" ? authHeader.split(" ")[1] : undefined;
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, configuration_1.default.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth-handler.js.map