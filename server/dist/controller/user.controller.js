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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchedule = exports.scheduleTimeTable = exports.updateCompetition = exports.resetPassword = exports.forgotPassword = exports.resendVerificationEmail = exports.verifyEmail = exports.signinUser = exports.signupUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUser = exports.createUser = void 0;
const user_service_1 = require("../service/user.service");
const user_competition_service_1 = require("../service/user-competition.service");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { FName, LName, Phone, Email, Password } = req.body;
        const savedUser = yield (0, user_service_1.createUserService)({
            FName,
            LName,
            Phone,
            Email,
            Password,
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            savedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllUser = yield (0, user_service_1.getAllUserService)();
        return res.status(200).json({
            success: true,
            message: "Successfully get all user",
            getAllUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUser = getAllUser;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getUser = yield (0, user_service_1.getUserByIdService)(id);
        return res.status(200).json({
            success: true,
            message: "Successfully get the user",
            getUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedUser = yield (0, user_service_1.updateUserService)(id, req.body);
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const wasDeleted = yield (0, user_service_1.deleteUserService)(id);
        if (!wasDeleted) {
            return res.status(404).json({
                success: false,
                message: "User not found or already deleted",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User successfully deleted",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
/**
 * @APIs below are the api's for the user only!
 */
const signupUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { FName, LName, Phone, Email, Password } = req.body;
        const savedUser = yield (0, user_service_1.signupUserService)(FName, LName, Phone, Email, Password);
        return res.status(201).json({
            success: true,
            message: "User signed up successfully",
            savedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signupUser = signupUser;
const signinUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Email, Password } = req.body;
        const { User, Token } = yield (0, user_service_1.signinUserService)(Email, Password);
        return res.status(200).json({
            success: true,
            message: "User signed in successfully",
            User,
            Token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signinUser = signinUser;
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const verifiedUser = yield (0, user_service_1.verifyEmailService)(token);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            verifiedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyEmail = verifyEmail;
const resendVerificationEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Email } = req.body;
        yield (0, user_service_1.resendVerificationEmailService)(Email);
        return res.status(200).json({
            success: true,
            message: "Verification email sent successfully! Please check your email for the verification link.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resendVerificationEmail = resendVerificationEmail;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Email } = req.body;
        yield (0, user_service_1.forgotPasswordService)(Email);
        return res.status(200).json({
            success: true,
            message: "Password reset email sent successfully! Please check your email for the reset link.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { Password } = req.body;
        yield (0, user_service_1.resetPasswordService)(token, Password);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully! Please login to your account.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
const updateCompetition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { CompetitionId } = req.body;
        const updatedUser = yield (0, user_competition_service_1.updateCompetitionService)(userId, CompetitionId);
        return res.status(200).json({
            success: true,
            message: "Competition updated successfully",
            updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateCompetition = updateCompetition;
const scheduleTimeTable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, user_competition_service_1.scheduleTimeTableService)(req.user.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Routine generated successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.scheduleTimeTable = scheduleTimeTable;
const updateUserSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { scheduleId } = req.params;
        const result = yield (0, user_competition_service_1.updateUserScheduleService)(userId, scheduleId, req.body);
        return res.status(200).json({
            success: true,
            message: "Schedule updated successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserSchedule = updateUserSchedule;
//# sourceMappingURL=user.controller.js.map