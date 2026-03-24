"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userScheduleTopicSchema = new mongoose_1.Schema({
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
}, { _id: false });
const userScheduleSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.Mixed,
        required: false
    },
    schedule: {
        type: [mongoose_1.Schema.Types.Mixed],
        required: false
    },
    selectedTopics: {
        type: [mongoose_1.Schema.Types.Mixed],
        required: false
    },
}, { timestamps: true });
userScheduleSchema.index({ userId: 1 }, { unique: true });
const userScheduleModel = mongoose_1.default.model("UserSchedule", userScheduleSchema);
exports.default = userScheduleModel;
//# sourceMappingURL=userSchedule.model.js.map