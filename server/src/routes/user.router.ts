/** @format */

import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  signinUser,
  signupUser,
  updateUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  updateCompetition,
  scheduleTimeTable,
  updateUserSchedule,
  patchScheduleSessionsCompletion,
  getTodayPlan,
  getActivePlan,
  checkDeadline
} from "../controller/user.controller";
import { adminMiddleware, authMiddleware } from "../helper/auth-handler";

const userRouter = Router();

userRouter.route("/").get(adminMiddleware, getAllUser).post(adminMiddleware, createUser);
userRouter.route("/update-competition").put(authMiddleware, updateCompetition);
userRouter.route("/schedule").post(authMiddleware, scheduleTimeTable);
userRouter
  .route("/schedule/:scheduleId/sessions")
  .patch(authMiddleware, patchScheduleSessionsCompletion);
userRouter.route("/schedule/:scheduleId").put(authMiddleware, updateUserSchedule);
userRouter.route("/today-plan").get(authMiddleware, getTodayPlan);
userRouter.route("/active-plan").get(authMiddleware, getActivePlan);
userRouter.route("/check-deadline").get(authMiddleware, checkDeadline);
userRouter.route("/:id").get(adminMiddleware, getUserById).put(adminMiddleware, updateUser).delete(adminMiddleware, deleteUser);

userRouter.route("/signup").post(signupUser);
userRouter.route("/signin").post(signinUser);
userRouter.route("/verify-email/:token").get(verifyEmail);
userRouter.route("/resend-verification-email").post(resendVerificationEmail);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/reset-password/:token").post(resetPassword);

export default userRouter;
