/** @format */

import userModel from "../model/user.model";
import bcrypt from "bcrypt";
import {
  IUser,
  ICreateUser,
  ISignedInUser,
} from "./interface/IUserService";
import { createUserValidation, forgotPasswordValidation, resendVerificationEmailValidation, resetPasswordValidation, signinUserValidation, signupUserValidation, updateUserValidation } from "../validation/user.validation";
import { generateToken, verifyToken } from "../helper/jwt-handler";
import { sendVerificationEmail } from "./email-service/user-signup-email";
import configuration from "../config/configuration";
import { sendForgetPasswordEmail } from "./email-service/forget-password-email";
import mongoose from "mongoose";

const createUserService = async ({
  FName,
  LName,
  Phone,
  Email,
  Password,
}: ICreateUser): Promise<IUser> => {
  try {
    if (!FName || !LName || !Email || !Password) {
      throw new Error("All fields are required!");
    }

    const { error } = createUserValidation.validate({ FName, LName, Phone, Email, Password });
    if(error) throw new Error(error.details[0].message || "Invalid input");

    const Role = "User";
    const hasedPassword = await bcrypt.hashSync(Password, 10);
    const newUser = new userModel({
      FName,
      LName,
      Phone,
      Email,
      Password: hasedPassword,
      IsVerified: true,
      Role,
    });
    const savedUser = await newUser.save();

    return {
      FName: savedUser.FName ?? undefined,
      LName: savedUser.LName ?? undefined,
      Phone: savedUser.Phone ? Number(savedUser.Phone) : undefined,
      Email: savedUser.Email ?? undefined,
      Role: savedUser.Role ?? undefined,
      _id: savedUser._id.toString() ?? undefined,
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const getAllUserService = async (): Promise<IUser[]> => {
  try {
    const users = await userModel.find();

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
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const getUserByIdService = async (id: string): Promise<IUser> => {
  try {
    if (!id) {
      throw new Error("User id is required!");
    }
    const user = await userModel.findById(id);
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
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const updateUserService = async (
  id: string,
  data: Partial<IUser>
): Promise<IUser | null> => {
  try {
    if (data.Phone && typeof data.Phone === "string") {
      data.Phone = Number(data.Phone);
    }
    if (!id) {
      throw new Error("Id is required!");
    }

    const { error } = updateUserValidation.validate(data);

    if (error) throw new Error(error.details[0].message);

    const updatedUser = await userModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedUser) {
      return null;
    }

    return {
      FName: updatedUser.FName ?? undefined,
      LName: updatedUser.LName ?? undefined,
      Phone: updatedUser.Phone ? Number(updatedUser.Phone) : undefined,
      Email: updatedUser.Email ?? undefined,
      Role: updatedUser.Role ?? undefined,
      _id: updatedUser._id.toString(),
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const deleteUserService = async (id: string): Promise<boolean> => {
  try {
    if (!id) {
      throw new Error("Id is required!");
    }
    const deletedUser = await userModel.findByIdAndDelete(id);
    if(!deletedUser) throw new Error("No user found or user already deleted!");
    return !!deletedUser;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const signupUserService = async (FName: string, LName: string, Phone: number, Email: string, Password: string): Promise<IUser> => {
  try {
    const { error } = signupUserValidation.validate({ FName, LName, Phone, Email, Password });
    if(error) throw new Error(error.details[0].message || "Invalid input");
    const hasedPassword = await bcrypt.hashSync(Password, 10);
    const newUser = new userModel({
      FName,
      LName,
      Phone,
      Email,
      Password: hasedPassword,
      Role: "User",
    });
    const savedUser = await newUser.save();
    const verificationToken = generateToken({ id: savedUser._id, email: savedUser.Email }, "10minutes");
    const base = String(configuration.FRONTEND_URL).replace(/\/?$/, "/");
    const verificationLink = `${base}user/verify-email/${verificationToken as string}`;
    // Do not block HTTP on Gmail SMTP — it can hang ~2min and clients time out while the user is already saved.
    void sendVerificationEmail(FName, Email, verificationLink).catch((err) => {
      console.error("[signup] verification email failed:", err);
    });
    return {
      FName: savedUser.FName || undefined,
      LName: savedUser.LName || undefined,
      Phone: savedUser.Phone ? Number(savedUser.Phone) : undefined,
      Email: savedUser.Email || undefined,
      Role: savedUser.Role || undefined,
      _id: savedUser._id.toString(),
    };
  } catch (error: any) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.Email &&
      error.keyValue &&
      error.keyValue.Email
    ) {
      throw new Error("Email is already registered");
    }

    throw new Error(error.message || "Internal server error");
  }
};

const signinUserService = async (Email: string, Password: string): Promise<ISignedInUser> => {
  try {
    const { error } = signinUserValidation.validate({ Email, Password });
    if(error) throw new Error(error.details[0].message || "Invalid input");
    const user = await userModel.findOne({ Email });
    if(!user) throw new Error("No user found with the provided email");
    const isPasswordValid: boolean = await bcrypt.compare(Password, user.Password as string);
    if(!isPasswordValid) throw new Error("Invalid password");
    
    // Check if user email is verified
    if(!user.IsVerified) {
      throw new Error("Account is not verified. Please verify your email first.");
    }
    
    return {
      User: {
        FName: user.FName ?? undefined,
        LName: user.LName ?? undefined,
        Phone: user.Phone ? Number(user.Phone) : undefined,
        Email: user.Email ?? undefined,
        Role: user.Role ?? undefined,
        IsVerified: user.IsVerified ?? undefined,
        CompetitionId: user.CompetitionId || undefined,
        _id: user._id.toString(),
      },
      Token: generateToken({ id: user._id, role: user.Role, email: user.Email }, "7d"),
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const verifyEmailService = async (token: string): Promise<boolean> => {
  try {
    const decoded = verifyToken(token);
    if(!decoded) throw new Error("Invalid token");
    const user = await userModel.findById(decoded.id);
    if(!user) throw new Error("No user found with the provided email");
    user.IsVerified = true;
    await user.save();
    return !!user;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const resendVerificationEmailService = async (Email: string): Promise<boolean> => {
  try {
    const { error } = resendVerificationEmailValidation.validate({ Email });
    if(error) throw new Error(error.details[0].message || "Invalid input");
    const user = await userModel.findOne({ Email });
    if(!user) throw new Error("No user found with the provided email");
    if(user.IsVerified) throw new Error("Email is already verified! Please login to your account.");
    const verificationToken = generateToken({ id: user._id, email: user.Email }, "10minutes");
    const base = String(configuration.FRONTEND_URL).replace(/\/?$/, "/");
    await sendVerificationEmail(user.FName, user.Email, `${base}user/verify-email/${verificationToken as string}`);
    return true;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const forgotPasswordService = async (Email: string): Promise<boolean> => {
  try {
    const { error } = forgotPasswordValidation.validate({ Email });
    if(error) throw new Error(error.details[0].message || "Invalid input");
    const user = await userModel.findOne({ Email });
    if(!user) throw new Error("No user found with the provided email");
    const verificationToken = generateToken({ id: user._id, email: user.Email }, "10minutes");
    const base = String(configuration.FRONTEND_URL).replace(/\/?$/, "/");
    await sendForgetPasswordEmail(user.FName, user.Email, `${base}user/reset-password/${verificationToken as string}`);
    return true;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error while sending the reset password email");
  }
};

const resetPasswordService = async (token: string, Password: string): Promise<boolean> => {
  try {
    const decoded = verifyToken(token);
    if(!decoded) throw new Error("Invalid token");
    const user = await userModel.findById(decoded.id);
    if(!user) throw new Error("No user found with the provided email");
    const { error } = resetPasswordValidation.validate({ Password });
    if(error) throw new Error(error.details[0].message || "Invalid input");
    const hasedPassword = await bcrypt.hashSync(Password, 10);
    user.Password = hasedPassword;
    await user.save();
    return true;
  } catch (error: any) {
    throw new Error(error.message || "Internal server error while resetting the password");
  }
};

export {
  createUserService,
  getAllUserService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  signupUserService,
  signinUserService,
  verifyEmailService,
  resendVerificationEmailService,
  forgotPasswordService,
  resetPasswordService,
};
