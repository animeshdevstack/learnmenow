"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.resendVerificationEmailValidation = exports.signinUserValidation = exports.signupUserValidation = exports.updateUserValidation = exports.createUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createUserValidation = joi_1.default.object({
    FName: joi_1.default.string().required(),
    LName: joi_1.default.string().required(),
    Phone: joi_1.default.number().optional(),
    Email: joi_1.default.string().email().required(),
    Password: joi_1.default.string().required().min(8).max(16).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")).messages({
        "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    }),
});
exports.createUserValidation = createUserValidation;
const updateUserValidation = joi_1.default.object({
    FName: joi_1.default.string(),
    LName: joi_1.default.string(),
    Phone: joi_1.default.number().optional(),
    Email: joi_1.default.string().email(),
    Password: joi_1.default.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"))
        .messages({
        "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    }),
});
exports.updateUserValidation = updateUserValidation;
const signupUserValidation = joi_1.default.object({
    FName: joi_1.default.string().required(),
    LName: joi_1.default.string().required(),
    Phone: joi_1.default.number().optional(),
    Email: joi_1.default.string().email().required(),
    Password: joi_1.default.string().required().min(8).max(16).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")).messages({
        "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    }),
});
exports.signupUserValidation = signupUserValidation;
const signinUserValidation = joi_1.default.object({
    Email: joi_1.default.string().email().required(),
    Password: joi_1.default.string().required().min(8).max(16).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")).messages({
        "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    }),
});
exports.signinUserValidation = signinUserValidation;
const resendVerificationEmailValidation = joi_1.default.object({
    Email: joi_1.default.string().email().required(),
});
exports.resendVerificationEmailValidation = resendVerificationEmailValidation;
const forgotPasswordValidation = joi_1.default.object({
    Email: joi_1.default.string().email().required(),
});
exports.forgotPasswordValidation = forgotPasswordValidation;
const resetPasswordValidation = joi_1.default.object({
    Password: joi_1.default.string().required().min(8).max(16).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")).messages({
        "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    }),
});
exports.resetPasswordValidation = resetPasswordValidation;
//# sourceMappingURL=user.validation.js.map