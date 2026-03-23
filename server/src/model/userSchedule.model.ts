/** @format */

import mongoose, { Schema } from "mongoose";
import IUserScheduleSchema from "../interface/IUserScheduleSchema";

const userScheduleTopicSchema = new Schema(
  {
    topicId: { type: String, required: true },
    topicName: { type: String, required: true },
    chapterName: { type: String, required: false, default: null },
    subjectName: { type: String, required: false, default: null },
    userPriority: { type: Number, required: true },
    allocatedMinutes: { type: Number, required: true },
    allocatedHours: { type: Number, required: true },
    adminPriority: { type: Number, required: false },
    finalWeight: { type: Number, required: false },
    rawAllocatedMinutes: { type: Number, required: false },
    maxDurationMinutes: { type: Number, required: false },
    isCompleted: { type: Boolean, default: false }
  },
  { _id: false }
);

const userScheduleSchema = new Schema<IUserScheduleSchema>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    preferredSlots: {
        type: [String],
        required: true
    },
    studyTime: {
        type: {
            weekdays: {
                type: Number,
                required: false
            },
            weekends: {
                type: Number,
                required: false
            }
        }
    },
    totalTime: {
        type: Number,
        required: true
    },
    topics: {
        type: [userScheduleTopicSchema],
        required: false
    },
    summary: {
        type: Schema.Types.Mixed,
        required: false
    },
    schedule: {
        type: [Schema.Types.Mixed],
        required: false
    },
    selectedTopics: {
        type: [Schema.Types.Mixed],
        required: false
    },
}, { timestamps: true });

userScheduleSchema.index({ userId: 1 }, { unique: true });

const userScheduleModel = mongoose.model<IUserScheduleSchema>("UserSchedule", userScheduleSchema);
export default userScheduleModel;
