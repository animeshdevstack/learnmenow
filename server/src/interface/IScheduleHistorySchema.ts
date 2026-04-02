/** @format */

import { Types } from "mongoose";

/** Snapshot of generated `schedule[]` on each POST `/user/schedule` (per-user history). */
interface IScheduleHistorySchema {
  userId: Types.ObjectId;
  schedule: Record<string, unknown>[];
}

export default IScheduleHistorySchema;
