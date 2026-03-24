"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configuration_1 = __importDefault(require("../config/configuration"));
const generateToken = (payload, expiresIn) => {
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, configuration_1.default.JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, configuration_1.default.JWT_SECRET);
    }
    catch (error) {
        return error;
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt-handler.js.map