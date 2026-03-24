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
exports.resetPasswordService = exports.forgotPasswordService = exports.resendVerificationEmailService = exports.verifyEmailService = exports.signinUserService = exports.signupUserService = exports.deleteUserService = exports.updateUserService = exports.getUserByIdService = exports.getAllUserService = exports.createUserService = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_validation_1 = require("../validation/user.validation");
const jwt_handler_1 = require("../helper/jwt-handler");
const user_signup_email_1 = require("./email-service/user-signup-email");
const configuration_1 = __importDefault(require("../config/configuration"));
const forget_password_email_1 = require("./email-service/forget-password-email");
const createUserService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ FName, LName, Phone, Email, Password, }) {
    var _b, _c, _d, _e, _f;
    try {
        if (!FName || !LName || !Email || !Password) {
            throw new Error("All fields are required!");
        }
        const { error } = user_validation_1.createUserValidation.validate({ FName, LName, Phone, Email, Password });
        if (error)
            throw new Error(error.details[0].message || "Invalid input");
        const Role = "User";
        const hasedPassword = yield bcrypt_1.default.hashSync(Password, 10);
        const newUser = new user_model_1.default({
            FName,
            LName,
            Phone,
            Email,
            Password: hasedPassword,
            IsVerified: true,
            Role,
        });
        const savedUser = yield newUser.save();
        return {
            FName: (_b = savedUser.FName) !== null && _b !== void 0 ? _b : undefined,
            LName: (_c = savedUser.LName) !== null && _c !== void 0 ? _c : undefined,
            Phone: savedUser.Phone ? Number(savedUser.Phone) : undefined,
            Email: (_d = savedUser.Email) !== null && _d !== void 0 ? _d : undefined,
            Role: (_e = savedUser.Role) !== null && _e !== void 0 ? _e : undefined,
            _id: (_f = savedUser._id.toString()) !== null && _f !== void 0 ? _f : undefined,
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.createUserService = createUserService;
const getAllUserService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        if (!users) {
            return [];
        }
        return users.map((user) => ({
            FName: user.FName || undefined,
            LName: user.LName || undefined,
            Phone: user.Phone ? Number(user.Phone) : undefined,
            Email: user.Email || undefined,
            Role: user.Role || undefined,
            _id: user._id.toString(),
        }));
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.getAllUserService = getAllUserService;
const getUserByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error("User id is required!");
        }
        const user = yield user_model_1.default.findById(id);
        if (!user) {
            throw new Error("No user is there with the provided id");
        }
        return {
            FName: user.FName || undefined,
            LName: user.LName || undefined,
            Phone: user.Phone ? Number(user.Phone) : undefined,
            Email: user.Email || undefined,
            Role: user.Role || undefined,
            _id: user._id.toString(),
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.getUserByIdService = getUserByIdService;
const updateUserService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        if (data.Phone && typeof data.Phone === "string") {
            data.Phone = Number(data.Phone);
        }
        if (!id) {
            throw new Error("Id is required!");
        }
        const { error } = user_validation_1.updateUserValidation.validate(data);
        if (error)
            throw new Error(error.details[0].message);
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!updatedUser) {
            return null;
        }
        return {
            FName: (_a = updatedUser.FName) !== null && _a !== void 0 ? _a : undefined,
            LName: (_b = updatedUser.LName) !== null && _b !== void 0 ? _b : undefined,
            Phone: updatedUser.Phone ? Number(updatedUser.Phone) : undefined,
            Email: (_c = updatedUser.Email) !== null && _c !== void 0 ? _c : undefined,
            Role: (_d = updatedUser.Role) !== null && _d !== void 0 ? _d : undefined,
            _id: updatedUser._id.toString(),
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.updateUserService = updateUserService;
const deleteUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error("Id is required!");
        }
        const deletedUser = yield user_model_1.default.findByIdAndDelete(id);
        if (!deletedUser)
            throw new Error("No user found or user already deleted!");
        return !!deletedUser;
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.deleteUserService = deleteUserService;
const signupUserService = (FName, LName, Phone, Email, Password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = user_validation_1.signupUserValidation.validate({ FName, LName, Phone, Email, Password });
        if (error)
            throw new Error(error.details[0].message || "Invalid input");
        const hasedPassword = yield bcrypt_1.default.hashSync(Password, 10);
        const newUser = new user_model_1.default({
            FName,
            LName,
            Phone,
            Email,
            Password: hasedPassword,
            Role: "User",
        });
        const savedUser = yield newUser.save();
        // TODO: Needs to send the Email for verification process: verification link needs to change.
        const verificationToken = (0, jwt_handler_1.generateToken)({ id: savedUser._id, email: savedUser.Email }, "10minutes");
        yield (0, user_signup_email_1.sendVerificationEmail)(FName, Email, `${configuration_1.default.FRONTEND_URL}user/verify-email/${verificationToken}`);
        return {
            FName: savedUser.FName || undefined,
            LName: savedUser.LName || undefined,
            Phone: savedUser.Phone ? Number(savedUser.Phone) : undefined,
            Email: savedUser.Email || undefined,
            Role: savedUser.Role || undefined,
            _id: savedUser._id.toString(),
        };
    }
    catch (error) {
        if (error.code === 11000 &&
            error.keyPattern &&
            error.keyPattern.Email &&
            error.keyValue &&
            error.keyValue.Email) {
            throw new Error("Email is already registered");
        }
        throw new Error(error.message || "Internal server error");
    }
});
exports.signupUserService = signupUserService;
const signinUserService = (Email, Password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { error } = user_validation_1.signinUserValidation.validate({ Email, Password });
        if (error)
            throw new Error(error.details[0].message || "Invalid input");
        const user = yield user_model_1.default.findOne({ Email });
        if (!user)
            throw new Error("No user found with the provided email");
        const isPasswordValid = yield bcrypt_1.default.compare(Password, user.Password);
        if (!isPasswordValid)
            throw new Error("Invalid password");
        // Check if user email is verified
        if (!user.IsVerified) {
            throw new Error("Account is not verified. Please verify your email first.");
        }
        return {
            User: {
                FName: (_a = user.FName) !== null && _a !== void 0 ? _a : undefined,
                LName: (_b = user.LName) !== null && _b !== void 0 ? _b : undefined,
                Phone: user.Phone ? Number(user.Phone) : undefined,
                Email: (_c = user.Email) !== null && _c !== void 0 ? _c : undefined,
                Role: (_d = user.Role) !== null && _d !== void 0 ? _d : undefined,
                IsVerified: (_e = user.IsVerified) !== null && _e !== void 0 ? _e : undefined,
                CompetitionId: user.CompetitionId || undefined,
                _id: user._id.toString(),
            },
            Token: (0, jwt_handler_1.generateToken)({ id: user._id, role: user.Role, email: user.Email }, "7d"),
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.signinUserService = signinUserService;
const verifyEmailService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, jwt_handler_1.verifyToken)(token);
        if (!decoded)
            throw new Error("Invalid token");
        const user = yield user_model_1.default.findById(decoded.id);
        if (!user)
            throw new Error("No user found with the provided email");
        user.IsVerified = true;
        yield user.save();
        return !!user;
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.verifyEmailService = verifyEmailService;
const resendVerificationEmailService = (Email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = user_validation_1.resendVerificationEmailValidation.validate({ Email });
        if (error)
            throw new Error(error.details[0].message || "Invalid input");
        const user = yield user_model_1.default.findOne({ Email });
        if (!user)
            throw new Error("No user found with the provided email");
        if (user.IsVerified)
            throw new Error("Email is already verified! Please login to your account.");
        const verificationToken = (0, jwt_handler_1.generateToken)({ id: user._id, email: user.Email }, "10minutes");
        yield (0, user_signup_email_1.sendVerificationEmail)(user.FName, user.Email, `${configuration_1.default.FRONTEND_URL}user/verify-email/${verificationToken}`);
        return true;
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.resendVerificationEmailService = resendVerificationEmailService;
const forgotPasswordService = (Email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = user_validation_1.forgotPasswordValidation.validate({ Email });
        if (error)
            throw new Error(error.details[0].message || "Invalid input");
        const user = yield user_model_1.default.findOne({ Email });
        if (!user)
            throw new Error("No user found with the provided email");
        const verificationToken = (0, jwt_handler_1.generateToken)({ id: user._id, email: user.Email }, "10minutes");
        yield (0, forget_password_email_1.sendForgetPasswordEmail)(user.FName, user.Email, `${configuration_1.default.FRONTEND_URL}user/reset-password/${verificationToken}`);
        return true;
    }
    catch (error) {
        throw new Error(error.message || "Internal server error while sending the reset password email");
    }
});
exports.forgotPasswordService = forgotPasswordService;
const resetPasswordService = (token, Password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, jwt_handler_1.verifyToken)(token);
        if (!decoded)
            throw new Error("Invalid token");
        const user = yield user_model_1.default.findById(decoded.id);
        if (!user)
            throw new Error("No user found with the provided email");
        const { error } = user_validation_1.resetPasswordValidation.validate({ Password });
        if (error)
            throw new Error(error.details[0].message || "Invalid input");
        const hasedPassword = yield bcrypt_1.default.hashSync(Password, 10);
        user.Password = hasedPassword;
        yield user.save();
        return true;
    }
    catch (error) {
        throw new Error(error.message || "Internal server error while resetting the password");
    }
});
exports.resetPasswordService = resetPasswordService;
//# sourceMappingURL=user.service.js.map