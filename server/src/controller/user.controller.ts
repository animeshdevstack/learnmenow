/** @format */

import { Request, Response, NextFunction } from "express";
import {
  createUserService,
  deleteUserService,
  getAllUserService,
  getUserByIdService,
  signupUserService,
  signinUserService,
  updateUserService,
  verifyEmailService,
  resendVerificationEmailService,
  forgotPasswordService,
  resetPasswordService,
} from "../service/user.service";
import {
  updateCompetitionService,
  scheduleTimeTableService,
  updateUserScheduleService,
  getActivePlanService,
  getTodayPlanService,
} from "../service/user-competition.service";

interface AuthRequest extends Request {
  user?: any;
}

const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { FName, LName, Phone, Email, Password } = req.body;
    
    const savedUser = await createUserService({
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
  } catch (error: any) {
    next(error);
  }
};

const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const getAllUser = await getAllUserService();
    return res.status(200).json({
      success: true,
      message: "Successfully get all user",
      getAllUser,
    });
  } catch (error: any) {
    next(error);
  }
};

const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const getUser = await getUserByIdService(id);
    return res.status(200).json({
      success: true,
      message: "Successfully get the user",
      getUser,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUserService(id, req.body);
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
  } catch (error: any) {
    next(error);
  }
};

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const wasDeleted = await deleteUserService(id);
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
  } catch (error: any) {
    next(error);
  }
};

/**
 * @APIs below are the api's for the user only!
 */

const signupUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { FName, LName, Phone, Email, Password } = req.body;
    const savedUser = await signupUserService(FName, LName, Phone, Email, Password);
    return res.status(201).json({
      success: true,
      message: "User signed up successfully",
      savedUser,
    });
  } catch (error: any) {
    next(error);
  }
};

const signinUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { Email, Password } = req.body;
    const { User, Token } = await signinUserService(Email, Password);
    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      User,
      Token,
    });
  } catch (error: any) {
    next(error);
  }
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { token } = req.params;
    const verifiedUser = await verifyEmailService(token as string);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      verifiedUser,
    }); 
  } catch (error: any) {
    next(error);
  }
};

const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { Email } = req.body;
    await resendVerificationEmailService(Email as string);
    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully! Please check your email for the verification link.",
    });
  } catch (error: any) {
    next(error);
  }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { Email } = req.body;
    await forgotPasswordService(Email as string);
    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully! Please check your email for the reset link.",
    });
  } catch (error: any) {
    next(error);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { token } = req.params;
    const { Password } = req.body;
    await resetPasswordService(token as string, Password as string);
    return res.status(200).json({
      success: true,
      message: "Password reset successfully! Please login to your account.",
    });
  } catch (error: any) {
    next(error);
  }
};

const updateCompetition = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = (req.user as any)?.id;
    const { CompetitionId } = req.body;
    const updatedUser = await updateCompetitionService(userId as string, CompetitionId as string);
    return res.status(200).json({
      success: true,
      message: "Competition updated successfully",
      updatedUser,
    });
  } catch (error: any) {
    next(error);
  }
};

const scheduleTimeTable = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result = await scheduleTimeTableService((req.user as any).id, req.body);

    return res.status(200).json({
      success: true,
      message: "Routine generated successfully",
      data: result
    });
  } catch (error: any) {
    next(error);
  }
};

const updateUserSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = (req.user as any)?.id;
    const { scheduleId } = req.params;
    const result = await updateUserScheduleService(
      userId as string,
      scheduleId as string,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Schedule updated successfully",
      data: result
    });
  } catch (error: any) {
    next(error);
  }
};

const getTodayPlan = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = (req.user as any)?.id;
    const todayPlan = await getTodayPlanService(userId as string);
    return res.status(200).json({
      success: true,
      message: "Today's plan fetched successfully",
      data: todayPlan
    });
  } catch (error: any) {
    next(error);
  }
};

const getActivePlan = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = (req.user as any)?.id;
    const plan = await getActivePlanService(userId as string);
    return res.status(200).json({
      success: true,
      message: "Active plan fetched successfully",
      data: plan
    });
  } catch (error: any) {
    next(error);
  }
};

export {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  signupUser,
  signinUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  updateCompetition,
  scheduleTimeTable,
  updateUserSchedule,
  getTodayPlan,
  getActivePlan
};