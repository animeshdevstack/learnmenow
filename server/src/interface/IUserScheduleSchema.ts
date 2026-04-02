/** @format */

import { Types } from "mongoose";

/** One row in `topics` — topic allocation card + persisted plan. */
interface IUserScheduleTopic {
  topicId: string;
  topicName: string;
  chapterName?: string | null;
  subjectName?: string | null;
  userPriority: number;
  /** Minutes scheduled for this topic in the plan. */
  allocatedMinutes: number;
  /** Same allocation as decimal hours (e.g. 1.5 for 90 min). */
  allocatedHours: number;
  adminPriority?: number;
  finalWeight?: number;
  rawAllocatedMinutes?: number;
  maxDurationMinutes?: number;
  isCompleted?: boolean;
}

/** Full planner output (summary, topics, schedule) stored for reload / history. */
interface IUserScheduleSchema {
  userId: Types.ObjectId;
  startDate: string;
  deadline: string;
  preferredSlots: string[];
  studyTime: {
    weekdays: number;
    weekends: number;
  };
  /** Total scheduled study minutes across topics. */
  totalTime: number;
  summary?: Record<string, unknown>;
  topics?: IUserScheduleTopic[];
  schedule?: Record<string, unknown>[];
  selectedTopics?: Record<string, unknown>[];
}

/** Partial body for PATCH `/user/schedule/:scheduleId/sessions` — toggles session completion. */
interface IPatchScheduleSessionsCompletionPayload {
  updates: Array<{
    date: string;
    topicId: string;
    isCompleted: boolean;
  }>;
}

/** Partial body for PUT `/user/schedule/:scheduleId` — only sent fields are applied. */
interface IUpdateUserSchedulePayload {
  summary?: Record<string, unknown>;
  topics?: IUserScheduleTopic[];
  schedule?: Record<string, unknown>[];
  selectedTopics?: Record<string, unknown>[];
  totalTime?: number;
  startDate?: string;
  deadline?: string;
  preferredSlots?: string[];
  studyTime?: { weekdays: number; weekends: number };
}

export type {
  IUserScheduleTopic,
  IUpdateUserSchedulePayload,
  IPatchScheduleSessionsCompletionPayload
};
export default IUserScheduleSchema;
