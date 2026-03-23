/** @format */
import mongoose from "mongoose";
interface ICreateUser {
  FName: string;
  LName: string;
  Phone: string;
  Email: string;
  Password: string;
}

interface IUser {
  FName?: string;
  LName?: string;
  Phone?: number;
  Email?: string;
  Role?: string;
  IsVerified?: boolean;
  CompetitionId?: mongoose.Types.ObjectId;
  _id: string;
}

interface ISignedInUser {
  User: IUser;
  Token: string;
}

interface ISelectedTopic {
  topicId: string;
  priority?: number;
}

/** User-chosen study window; each maps to a clock range used for random session times. */
type SchedulePreferredSlot =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "late_night";

interface IScheduleTimeTablePayload {
  startDate: string;
  deadline: string;
  /** One or more slots; each scheduled day picks one at random, then random times within that slot. */
  preferredSlots?: SchedulePreferredSlot[];
  /** @deprecated Use `preferredSlots`; still accepted as a single-element list. */
  preferredSlot?: SchedulePreferredSlot;
  studyTime: {
    weekdays: number;
    weekends: number;
  };
  selectedTopics: ISelectedTopic[];
}

export {
  ICreateUser,
  IUser,
  ISignedInUser,
  ISelectedTopic,
  IScheduleTimeTablePayload,
  type SchedulePreferredSlot
};
