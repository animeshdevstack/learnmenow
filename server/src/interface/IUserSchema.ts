/** @format */

import { Types } from "mongoose";

interface IUserSchema {
  FName: string;
  LName: string;
  Phone?: number; // Optional for all users
  Email: string;
  Password?: string;
  Role: "Admin" | "User";
  IsVerified: boolean;
  /** Competition ref (`Competiton` collection). */
  CompetitionId?: Types.ObjectId;
  GoogleId?: string;
  Avatar?: string;
}

export default IUserSchema;
