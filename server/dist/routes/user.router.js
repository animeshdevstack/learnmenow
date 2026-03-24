"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const auth_handler_1 = require("../helper/auth-handler");
const userRouter = (0, express_1.Router)();
userRouter.route("/").get(auth_handler_1.adminMiddleware, user_controller_1.getAllUser).post(auth_handler_1.adminMiddleware, user_controller_1.createUser);
userRouter.route("/update-competition").put(auth_handler_1.authMiddleware, user_controller_1.updateCompetition);
userRouter.route("/schedule").post(auth_handler_1.authMiddleware, user_controller_1.scheduleTimeTable);
userRouter.route("/schedule/:scheduleId").put(auth_handler_1.authMiddleware, user_controller_1.updateUserSchedule);
userRouter.route("/:id").get(auth_handler_1.adminMiddleware, user_controller_1.getUserById).put(auth_handler_1.adminMiddleware, user_controller_1.updateUser).delete(auth_handler_1.adminMiddleware, user_controller_1.deleteUser);
userRouter.route("/signup").post(user_controller_1.signupUser);
userRouter.route("/signin").post(user_controller_1.signinUser);
userRouter.route("/verify-email/:token").get(user_controller_1.verifyEmail);
userRouter.route("/resend-verification-email").post(user_controller_1.resendVerificationEmail);
userRouter.route("/forgot-password").post(user_controller_1.forgotPassword);
userRouter.route("/reset-password/:token").post(user_controller_1.resetPassword);
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map