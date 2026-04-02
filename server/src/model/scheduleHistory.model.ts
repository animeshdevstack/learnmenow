/** @format */

import mongoose, { Schema } from "mongoose";
import IScheduleHistorySchema from "../interface/IScheduleHistorySchema";

const scheduleHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    schedule: {
      type: [Schema.Types.Mixed],
      required: true
    }
  },
  { timestamps: true }
);

scheduleHistorySchema.index({ userId: 1, createdAt: -1 });

const scheduleHistoryModel = mongoose.model<IScheduleHistorySchema>(
  "ScheduleHistory",
  scheduleHistorySchema
);

export default scheduleHistoryModel;
