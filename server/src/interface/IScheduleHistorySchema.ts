/** @format */

import { Types } from "mongoose";

/** Snapshot of generated `schedule[]` on each POST `/user/schedule` (per-user history). */
interface IScheduleHistorySchema {
  userId: Types.ObjectId;
  /** Same document as `UserSchedule` at snapshot time — used to mirror session completion updates. */
  linkedScheduleId?: Types.ObjectId;
  schedule: Record<string, unknown>[];
}

export default IScheduleHistorySchema;
