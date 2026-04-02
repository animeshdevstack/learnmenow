/** @format */

import mongoose, { Schema } from "mongoose";
import IScheduleHistorySchema from "../interface/IScheduleHistorySchema";

const scheduleHistorySessionSchema = new Schema(
  {
    topicId: { type: String, required: true },
    topicName: { type: String, required: false },
    chapterName: { type: String, required: false, default: null },
    subjectName: { type: String, required: false, default: null },
    durationMinutes: { type: Number, required: false },
    preferredSlot: { type: String, required: false },
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    startDate: { type: String, required: false },
    endDate: { type: String, required: false },
    spansNextDay: { type: Boolean, required: false, default: false },
    isCompleted: { type: Boolean, required: false, default: false }
  },
  { _id: false, strict: false }
);

const scheduleHistoryDaySchema = new Schema(
  {
    date: { type: String, required: true },
    dayType: { type: String, required: false },
    preferredSlot: { type: String, required: false },
    availableMinutes: { type: Number, required: false },
    usedMinutes: { type: Number, required: false },
    overflowPastSlot: { type: Boolean, required: false, default: false },
    sessions: { type: [scheduleHistorySessionSchema], required: false, default: [] }
  },
  { _id: false, strict: false }
);

const scheduleHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    linkedScheduleId: {
      type: Schema.Types.ObjectId,
      ref: "UserSchedule",
      required: false,
      index: true
    },
    schedule: {
      type: [scheduleHistoryDaySchema],
      required: true
    }
  },
  { timestamps: true }
);

scheduleHistorySchema.index({ userId: 1, createdAt: -1 });
scheduleHistorySchema.index({ userId: 1, linkedScheduleId: 1 });

const scheduleHistoryModel = mongoose.model<IScheduleHistorySchema>(
  "ScheduleHistory",
  scheduleHistorySchema
);

export default scheduleHistoryModel;
