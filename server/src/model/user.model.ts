/** @format */

import mongoose, { Schema } from "mongoose";
import IUserSchema from "../interface/IUserSchema";

const userSchema = new Schema<IUserSchema>({
  FName: {
    type: String,
    required: true,
  },
  LName: {
    type: String,
    required: true,
  },
  Phone: {
    type: Number,
    unique: true,
    sparse: true, // Allows multiple null values
    required: false, // Make it completely optional
  },
  Email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  Password: {
    type: String,
    required: function() {
      return !this.GoogleId; // Only required if not a Google OAuth user
    },
  },
  Role: {
    type: String,
    enum: ["Admin", "User"],
    require: true,
  },
  CompetitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competiton",
  },
  IsVerified: {
    type: Boolean,
    default: false,
  },
  GoogleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  Avatar: {
    type: String,
  },
}, { timestamps: true });

const userModel = mongoose.model<IUserSchema>("User", userSchema);
export default userModel;
