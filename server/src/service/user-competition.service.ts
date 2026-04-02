/** @format */

import userModel from "../model/user.model";
import mongoose from "mongoose";
import {
  IUser,
  IScheduleTimeTablePayload,
  SchedulePreferredSlot
} from "./interface/IUserService";
import { getTopicsWithChapterAndSubject } from "../repositories/routine.repository";
import userScheduleModel from "../model/userSchedule.model";
import scheduleHistoryModel from "../model/scheduleHistory.model";
import type {
  IUpdateUserSchedulePayload,
  IPatchScheduleSessionsCompletionPayload
} from "../interface/IUserScheduleSchema";

const MINUTES_PER_DAY = 24 * 60;

const SCHEDULE_SLOT_VALUES: SchedulePreferredSlot[] = [
  "morning",
  "afternoon",
  "evening",
  "night",
  "late_night"
];

/** Legacy API values still accepted for older clients. */
const LEGACY_PREFERRED_SLOT_MAP: Record<string, SchedulePreferredSlot> = {
  morning: "morning",
  evening: "evening",
  night: "night"
};

/**
 * Clock windows (minutes from midnight, end exclusive).
 * late_night has two segments: end of day 23:00–24:00 and early 00:00–05:00.
 */
const slotSegments = (
  slot: SchedulePreferredSlot
): Array<{ start: number; end: number }> => {
  switch (slot) {
    case "morning":
      return [{ start: 5 * 60, end: 12 * 60 }];
    case "afternoon":
      return [{ start: 12 * 60, end: 17 * 60 }];
    case "evening":
      return [{ start: 17 * 60, end: 21 * 60 }];
    case "night":
      return [{ start: 21 * 60, end: 23 * 60 }];
    case "late_night":
      return [
        { start: 23 * 60, end: MINUTES_PER_DAY },
        { start: 0, end: 5 * 60 }
      ];
    default:
      return [{ start: 5 * 60, end: 12 * 60 }];
  }
};

const normalizePreferredSlot = (raw: string): SchedulePreferredSlot => {
  const key = String(raw).toLowerCase().trim();
  if (SCHEDULE_SLOT_VALUES.includes(key as SchedulePreferredSlot)) {
    return key as SchedulePreferredSlot;
  }
  if (LEGACY_PREFERRED_SLOT_MAP[key]) {
    return LEGACY_PREFERRED_SLOT_MAP[key];
  }
  throw new Error(
    "preferredSlot must be morning, afternoon, evening, night or late_night"
  );
};

/**
 * Resolves `preferredSlots` array or legacy single `preferredSlot` string.
 * Dedupes while preserving first-seen order.
 */
const normalizePreferredSlotsInput = (data: IScheduleTimeTablePayload): SchedulePreferredSlot[] => {
  const fromArray = data.preferredSlots;
  const legacy = data.preferredSlot;

  let rawList: unknown[];
  if (Array.isArray(fromArray) && fromArray.length > 0) {
    rawList = fromArray;
  } else if (legacy != null && String(legacy).trim() !== "") {
    rawList = [legacy];
  } else {
    throw new Error("preferredSlots (non-empty array) or preferredSlot is required");
  }

  const seen = new Set<string>();
  const out: SchedulePreferredSlot[] = [];
  for (const item of rawList) {
    const s = normalizePreferredSlot(String(item));
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  if (out.length === 0) {
    throw new Error("At least one valid preferred slot is required");
  }
  return out;
};

const pickRandomSlot = (slots: SchedulePreferredSlot[]): SchedulePreferredSlot => {
  return slots[randomInt(0, slots.length)]!;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const minutesToHHMM = (minutesFromMidnight: number): string => {
  const m = ((minutesFromMidnight % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${pad2(h)}:${pad2(min)}`;
};

const addDaysIso = (dateStr: string, days: number): string => {
  const d = new Date(`${dateStr}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
};

const randomInt = (minInclusive: number, maxExclusive: number): number => {
  if (maxExclusive <= minInclusive) return minInclusive;
  return minInclusive + Math.floor(Math.random() * (maxExclusive - minInclusive));
};

const SLOT_CLOCK_RANGE_LABEL: Record<SchedulePreferredSlot, string> = {
  morning: "05:00–12:00",
  afternoon: "12:00–17:00",
  evening: "17:00–21:00",
  night: "21:00–23:00",
  late_night: "23:00–24:00 or 00:00–05:00 (one segment per day, chosen at random)"
};

type SessionForTiming = {
  topicId: string;
  topicName: string;
  chapterName: string | null;
  subjectName: string | null;
  durationMinutes: number;
  preferredSlot: SchedulePreferredSlot;
};

type TimedSession = SessionForTiming & {
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  spansNextDay: boolean;
  isCompleted: boolean;
};

/**
 * Places sessions back-to-back from a random start inside the chosen slot window.
 * If total duration exceeds the window, times extend past the slot (overflow).
 * late_night: one segment is chosen at random for that day (23:00–24:00 or 00:00–05:00).
 */
const assignClockTimesToDaySessions = (
  dayDate: string,
  sessions: SessionForTiming[],
  slot: SchedulePreferredSlot
): { timed: TimedSession[]; overflowPastSlot: boolean } => {
  if (sessions.length === 0) {
    return { timed: [], overflowPastSlot: false };
  }

  const segments = slotSegments(slot);
  const seg =
    slot === "late_night"
      ? segments[randomInt(0, segments.length)]!
      : segments[0]!;

  const windowLen = seg.end - seg.start;
  const totalDur = sessions.reduce((s, x) => s + x.durationMinutes, 0);

  let maxOffset = windowLen - totalDur;
  if (maxOffset < 0) maxOffset = 0;
  const offset = randomInt(0, maxOffset + 1);
  let cursor = seg.start + offset;

  const timed: TimedSession[] = [];
  let overflowPastSlot = totalDur > windowLen;

  for (const sess of sessions) {
    const startAbs = cursor;
    const endAbs = startAbs + sess.durationMinutes;

    const startDayOffset = Math.floor(startAbs / MINUTES_PER_DAY);
    const endDayOffset = Math.floor(endAbs / MINUTES_PER_DAY);

    const startDate = addDaysIso(dayDate, startDayOffset);
    const endDate = addDaysIso(dayDate, endDayOffset);

    const startTime = minutesToHHMM(startAbs);
    const endTime = minutesToHHMM(endAbs);

    timed.push({
      ...sess,
      preferredSlot: slot,
      startTime,
      endTime,
      startDate,
      endDate,
      spansNextDay: endDate !== startDate,
      isCompleted: false
    });

    cursor = endAbs;
  }

  return { timed, overflowPastSlot };
};

const updateCompetitionService = async (userId: string, CompetitionId: string): Promise<IUser> => {
  try {
    if (!mongoose.isValidObjectId(userId)) throw new Error("Invalid user id");
    if (!mongoose.isValidObjectId(CompetitionId)) throw new Error("Invalid competition id");

    const user = await userModel.findById(userId);
    if (!user) throw new Error("No user found with the provided userId");

    if (user.Role === "User" && user.CompetitionId) {
      throw new Error("Competition already exists");
    }

    user.CompetitionId = new mongoose.Types.ObjectId(CompetitionId);
    await user.save();
    return {
      FName: user.FName || undefined,
      LName: user.LName || undefined,
      Phone: user.Phone ? Number(user.Phone) : undefined,
      Email: user.Email || undefined,
      Role: user.Role || undefined,
      CompetitionId: user.CompetitionId || undefined,
      _id: user._id.toString(),
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error while updating the competition");
  }
};

const scheduleTimeTableService = async (
  userId: string,
  data: IScheduleTimeTablePayload
): Promise<any> => {
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user id");
    }

    const { startDate, deadline, studyTime, selectedTopics } = data;

    if (!startDate || !deadline || !studyTime) {
      throw new Error("startDate, deadline and studyTime are required");
    }

    const resolvedSlots = normalizePreferredSlotsInput(data);

    if (
      typeof studyTime.weekdays !== "number" ||
      typeof studyTime.weekends !== "number"
    ) {
      throw new Error("studyTime.weekdays and studyTime.weekends must be numbers");
    }

    if (
      studyTime.weekdays < 0 ||
      studyTime.weekends < 0 ||
      !Number.isFinite(studyTime.weekdays) ||
      !Number.isFinite(studyTime.weekends)
    ) {
      throw new Error("studyTime.weekdays and studyTime.weekends must be non-negative finite numbers");
    }

    if (!Array.isArray(selectedTopics) || selectedTopics.length === 0) {
      throw new Error("selectedTopics is required");
    }

    for (const item of selectedTopics) {
      if (!item.topicId) {
        throw new Error("Each selected topic must have topicId");
      }

      if (!mongoose.isValidObjectId(item.topicId)) {
        throw new Error(`Invalid topic id: ${item.topicId}`);
      }

      if (item.priority !== undefined) {
        if (
          typeof item.priority !== "number" ||
          item.priority < 1 ||
          item.priority > 5
        ) {
          throw new Error("Priority must be a number between 1 and 5");
        }
      }
    }

    const user = await userModel.findById(userId).lean();
    if (!user) {
      throw new Error("No user found with the provided user id");
    }

    if (!(user as any).CompetitionId) {
      throw new Error("Competition is not selected for this user");
    }

    const start = new Date(startDate);
    const end = new Date(deadline);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new Error("Invalid startDate or deadline");
    }

    if (start > end) {
      throw new Error("startDate cannot be greater than deadline");
    }

    let weekdayCount = 0;
    let weekendCount = 0;
    let totalAvailableMinutes = 0;

    const days: Array<{
      date: string;
      dayType: "weekday" | "weekend";
      availableMinutes: number;
    }> = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const current = new Date(d);
      const day = current.getDay();
      const isWeekend = day === 0 || day === 6;

      const availableMinutes = isWeekend
        ? Number(studyTime.weekends) * 60
        : Number(studyTime.weekdays) * 60;

      if (isWeekend) weekendCount++;
      else weekdayCount++;

      totalAvailableMinutes += availableMinutes;

      days.push({
        date: current.toISOString().split("T")[0],
        dayType: isWeekend ? "weekend" : "weekday",
        availableMinutes
      });
    }

    if (totalAvailableMinutes <= 0) {
      throw new Error("Total available study time must be greater than 0");
    }

    const topicDocs = await getTopicsWithChapterAndSubject(
      selectedTopics.map((item) => item.topicId),
      String((user as any).CompetitionId)
    );

    const topicMap = new Map(
      topicDocs.map((item: any) => [String(item._id), item])
    );

    const resolvedTopics = selectedTopics.map((selectedTopic) => {
      const topic: any = topicMap.get(selectedTopic.topicId);

      if (!topic) {
        throw new Error(
          `Topic not found or does not belong to user's competition: ${selectedTopic.topicId}`
        );
      }

      const chapter = topic.chapter || null;
      const subject = topic.subject || null;

      const userPriority = selectedTopic.priority ?? 1;

      const adminTopicPriority = Number(topic.Priority ?? 0);
      const adminChapterPriority = Number(chapter?.Priority ?? 0);
      const adminSubjectPriority = Number(subject?.Priority ?? 0);

      const adminPriority =
        adminTopicPriority ||
        adminChapterPriority ||
        adminSubjectPriority ||
        0;

      // Duration is treated as MAX duration only
      const maxDurationMinutes =
        Number(topic.Duration ?? 0) ||
        Number(chapter?.Duration ?? 0) ||
        Number(subject?.Duration ?? 0) ||
        60;

      return {
        topicId: String(topic._id),
        topicName: topic.Name,
        chapterName: chapter?.Name || null,
        subjectName: subject?.Name || null,
        userPriority,
        adminPriority,
        adminTopicPriority,
        adminChapterPriority,
        adminSubjectPriority,
        maxDurationMinutes,
        finalWeight: userPriority * 100 + adminPriority
      };
    });

    const totalWeight = resolvedTopics.reduce(
      (sum, item) => sum + item.finalWeight,
      0
    );

    let allocatedTopics = resolvedTopics.map((item) => {
      const rawAllocatedMinutes =
        totalWeight > 0
          ? Math.round((item.finalWeight / totalWeight) * totalAvailableMinutes)
          : 0;

      return {
        ...item,
        rawAllocatedMinutes,
        allocatedMinutes: Math.min(rawAllocatedMinutes, item.maxDurationMinutes)
      };
    });

    // Remove topics with 0 allocated time
    allocatedTopics = allocatedTopics.filter((item) => item.allocatedMinutes > 0);

    // Sort topics:
    // 1. userPriority desc
    // 2. adminTopicPriority desc
    // 3. adminChapterPriority desc
    // 4. adminSubjectPriority desc
    allocatedTopics.sort((a, b) => {
      if (b.userPriority !== a.userPriority) return b.userPriority - a.userPriority;
      if (b.adminTopicPriority !== a.adminTopicPriority) {
        return b.adminTopicPriority - a.adminTopicPriority;
      }
      if (b.adminChapterPriority !== a.adminChapterPriority) {
        return b.adminChapterPriority - a.adminChapterPriority;
      }
      return b.adminSubjectPriority - a.adminSubjectPriority;
    });

    const getSessionLength = (priority: number) => {
      if (priority === 5) return 90;
      if (priority === 4) return 75;
      if (priority === 3) return 60;
      if (priority === 2) return 45;
      return 30;
    };

    const sessionPool: SessionForTiming[] = [];

    for (const topic of allocatedTopics) {
      let remaining = topic.allocatedMinutes;
      const sessionLength = getSessionLength(topic.userPriority);

      while (remaining > 0) {
        const currentSession = Math.min(sessionLength, remaining);

        sessionPool.push({
          topicId: topic.topicId,
          topicName: topic.topicName,
          chapterName: topic.chapterName,
          subjectName: topic.subjectName,
          durationMinutes: currentSession,
          preferredSlot: resolvedSlots[0]!
        });

        remaining -= currentSession;
      }
    }

    const schedule: Array<{
      date: string;
      dayType: "weekday" | "weekend";
      preferredSlot: SchedulePreferredSlot;
      availableMinutes: number;
      usedMinutes: number;
      overflowPastSlot: boolean;
      sessions: TimedSession[];
    }> = [];

    let sessionPointer = 0;

    for (const day of days) {
      let remainingMinutes = day.availableMinutes;
      const sessions: SessionForTiming[] = [];

      while (sessionPointer < sessionPool.length) {
        const nextSession = sessionPool[sessionPointer];

        if (nextSession.durationMinutes <= remainingMinutes) {
          sessions.push(nextSession);
          remainingMinutes -= nextSession.durationMinutes;
          sessionPointer++;
        } else {
          break;
        }
      }

      if (sessions.length === 0) {
        continue;
      }

      const daySlot = pickRandomSlot(resolvedSlots);

      const { timed, overflowPastSlot } = assignClockTimesToDaySessions(
        day.date,
        sessions,
        daySlot
      );

      schedule.push({
        date: day.date,
        dayType: day.dayType,
        preferredSlot: daySlot,
        availableMinutes: day.availableMinutes,
        usedMinutes: day.availableMinutes - remainingMinutes,
        overflowPastSlot,
        sessions: timed
      });
    }

    const totalScheduledMinutes = allocatedTopics.reduce(
      (sum, item) => sum + item.allocatedMinutes,
      0
    );

    const summary = {
      startDate,
      deadline,
      preferredSlots: resolvedSlots,
      preferredSlot: resolvedSlots[0],
      slotClockRange:
        resolvedSlots.length === 1
          ? SLOT_CLOCK_RANGE_LABEL[resolvedSlots[0]!]
          : resolvedSlots.map((s) => `${s}: ${SLOT_CLOCK_RANGE_LABEL[s]}`).join(" · "),
      weekdayCount,
      weekendCount,
      totalAvailableMinutes,
      totalAvailableHours: +(totalAvailableMinutes / 60).toFixed(2),
      totalScheduledMinutes,
      totalScheduledHours: +(totalScheduledMinutes / 60).toFixed(2),
      unusedMinutes: totalAvailableMinutes - totalScheduledMinutes,
      unusedHours: +((totalAvailableMinutes - totalScheduledMinutes) / 60).toFixed(2),
      totalTopics: allocatedTopics.length
    };

    const topics = allocatedTopics.map((item) => ({
      topicId: item.topicId,
      topicName: item.topicName,
      chapterName: item.chapterName,
      subjectName: item.subjectName,
      userPriority: item.userPriority,
      adminPriority: item.adminPriority,
      finalWeight: item.finalWeight,
      rawAllocatedMinutes: item.rawAllocatedMinutes,
      maxDurationMinutes: item.maxDurationMinutes,
      allocatedMinutes: item.allocatedMinutes,
      allocatedHours: +(item.allocatedMinutes / 60).toFixed(2),
      isCompleted: false
    }));

    const saved = await userScheduleModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          startDate,
          deadline,
          preferredSlots: resolvedSlots,
          studyTime,
          selectedTopics: allocatedTopics.map((item) => ({
            topicId: item.topicId,
            userPriority: item.userPriority,
            isCompleted: false,
            timeAllocated: item.allocatedMinutes
          })),
          totalTime: totalScheduledMinutes,
          summary,
          topics,
          schedule
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    await scheduleHistoryModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      schedule
    });

    return {
      scheduleId: String(saved._id),
      summary,
      topics,
      schedule
    };
  } catch (error: any) {
    throw new Error(
      error.message || "Internal server error while scheduling the time table"
    );
  }
};

const UPDATE_SCHEDULE_KEYS: (keyof IUpdateUserSchedulePayload)[] = [
  "summary",
  "topics",
  "schedule",
  "selectedTopics",
  "totalTime",
  "startDate",
  "deadline",
  "preferredSlots",
  "studyTime"
];

const updateUserScheduleService = async (
  userId: string,
  scheduleId: string,
  data: IUpdateUserSchedulePayload
): Promise<{
  scheduleId: string;
  summary?: unknown;
  topics?: unknown;
  schedule?: unknown;
  startDate: string;
  deadline: string;
  preferredSlots: string[];
  studyTime?: { weekdays: number; weekends: number };
  totalTime: number;
}> => {
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user id");
    }
    if (!mongoose.isValidObjectId(scheduleId)) {
      throw new Error("Invalid schedule id");
    }

    const $set: Record<string, unknown> = {};
    for (const key of UPDATE_SCHEDULE_KEYS) {
      const value = data[key];
      if (value !== undefined) {
        $set[key] = value;
      }
    }

    if (Object.keys($set).length === 0) {
      throw new Error(
        "No updatable fields provided. Send one or more of: summary, topics, schedule, selectedTopics, totalTime, startDate, deadline, preferredSlots, studyTime"
      );
    }

    const updated = await userScheduleModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(scheduleId),
        userId: new mongoose.Types.ObjectId(userId)
      },
      { $set },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new Error(
        "Schedule not found or you do not have permission to update it."
      );
    }

    return {
      scheduleId: String(updated._id),
      summary: updated.summary,
      topics: updated.topics,
      schedule: updated.schedule,
      startDate: updated.startDate,
      deadline: updated.deadline,
      preferredSlots: updated.preferredSlots,
      studyTime: updated.studyTime,
      totalTime: updated.totalTime
    };
  } catch (error: any) {
    throw new Error(
      error.message || "Internal server error while updating the schedule"
    );
  }
};

function schedulePatchReturnShape(updated: {
  _id: unknown;
  summary?: unknown;
  topics?: unknown;
  schedule?: unknown;
  startDate: string;
  deadline: string;
  preferredSlots: string[];
  studyTime?: { weekdays: number; weekends: number };
  totalTime: number;
}) {
  return {
    scheduleId: String(updated._id),
    summary: updated.summary,
    topics: updated.topics,
    schedule: updated.schedule,
    startDate: updated.startDate,
    deadline: updated.deadline,
    preferredSlots: updated.preferredSlots,
    studyTime: updated.studyTime,
    totalTime: updated.totalTime
  };
}

/** PATCH nested `schedule[].sessions[].isCompleted` without replacing the whole schedule. */
const patchScheduleSessionsCompletionService = async (
  userId: string,
  scheduleId: string,
  body: IPatchScheduleSessionsCompletionPayload
): Promise<ReturnType<typeof schedulePatchReturnShape>> => {
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user id");
    }
    if (!mongoose.isValidObjectId(scheduleId)) {
      throw new Error("Invalid schedule id");
    }

    const updates = body?.updates;
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error(
        "Provide a non-empty updates array: { date, topicId, isCompleted }[]"
      );
    }

    for (let i = 0; i < updates.length; i++) {
      const u = updates[i];
      if (!u || typeof u.date !== "string" || !u.date.trim()) {
        throw new Error(`updates[${i}]: date is required`);
      }
      if (typeof u.topicId !== "string" || !u.topicId.trim()) {
        throw new Error(`updates[${i}]: topicId is required`);
      }
      if (typeof u.isCompleted !== "boolean") {
        throw new Error(`updates[${i}]: isCompleted must be a boolean`);
      }
    }

    const doc = await userScheduleModel.findOne({
      _id: new mongoose.Types.ObjectId(scheduleId),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!doc) {
      throw new Error(
        "Schedule not found or you do not have permission to update it."
      );
    }

    const schedule = doc.schedule;
    if (!Array.isArray(schedule)) {
      throw new Error("This plan has no schedule days to update");
    }

    for (const u of updates) {
      const day = schedule.find(
        (d: unknown) =>
          d !== null &&
          typeof d === "object" &&
          "date" in d &&
          (d as { date: string }).date === u.date
      ) as { sessions?: unknown[] } | undefined;

      if (!day || !Array.isArray(day.sessions)) {
        throw new Error(`No sessions found for date ${u.date}`);
      }

      let matched = false;
      for (const session of day.sessions) {
        if (
          session &&
          typeof session === "object" &&
          "topicId" in session &&
          String((session as { topicId: string }).topicId) ===
            String(u.topicId)
        ) {
          (session as unknown as { isCompleted: boolean }).isCompleted =
            u.isCompleted;
          matched = true;
        }
      }

      if (!matched) {
        throw new Error(
          `No session with topicId ${u.topicId} on date ${u.date}`
        );
      }
    }

    doc.markModified("schedule");
    await doc.save();

    return schedulePatchReturnShape(doc);
  } catch (error: any) {
    throw new Error(
      error.message || "Internal server error while patching sessions"
    );
  }
};

/** Full saved timetable for the user (read-only view). */
const getActivePlanService = async (userId: string): Promise<any> => {
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user id");
    }
    const doc = await userScheduleModel
      .findOne({ userId: new mongoose.Types.ObjectId(userId) })
      .lean();
    if (!doc) {
      throw new Error("No plan found for the user");
    }
    return {
      scheduleId: String(doc._id),
      summary: doc.summary ?? null,
      topics: Array.isArray(doc.topics) ? doc.topics : [],
      schedule: Array.isArray(doc.schedule) ? doc.schedule : [],
      startDate: doc.startDate,
      deadline: doc.deadline,
      preferredSlots: doc.preferredSlots,
      studyTime: doc.studyTime,
      totalTime: doc.totalTime,
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const getTodayPlanService = async (userId: string): Promise<any> => {
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user id");
    }
    const userPlan = await userScheduleModel.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!userPlan) {
      throw new Error("No plan found for the user");
    }
    const userSchedule = userPlan.schedule;
    if (!userSchedule) {
      throw new Error("No schedule found for the user");
    }
    const todayUtc = new Date().toISOString().split("T")[0];
    const todaySchedule = userSchedule.find((item: any) => item?.date === todayUtc);
    if (!todaySchedule) {
      throw new Error("No schedule found today");
    }
    // Day entries are plain objects in `schedule[]` (no `_id`). The plan document id is `userPlan._id`.
    return {
      scheduleId: String(userPlan._id),
      summary: userPlan.summary,
      topics: userPlan.topics,
      day: todaySchedule
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const checkDeadlineService = async (userId: string): Promise<boolean> => {
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user id");
    }
    const userPlan = await userScheduleModel.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!userPlan) {
      throw new Error("No plan found for the user");
    }
    const deadline = new Date(userPlan.deadline);
    const today = new Date();
    /** `true` when the deadline instant is in the past (same instant comparison as before, inverted). */
    return deadline.getTime() <= today.getTime();  
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const SCHEDULE_HISTORY_DEFAULT_PAGE = 1;
const SCHEDULE_HISTORY_DEFAULT_LIMIT = 10;
const SCHEDULE_HISTORY_MAX_LIMIT = 50;

const parseScheduleHistoryPage = (raw: unknown): number => {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return SCHEDULE_HISTORY_DEFAULT_PAGE;
  return Math.floor(n);
};

const parseScheduleHistoryLimit = (raw: unknown): number => {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return SCHEDULE_HISTORY_DEFAULT_LIMIT;
  return Math.min(Math.floor(n), SCHEDULE_HISTORY_MAX_LIMIT);
};

export type ScheduleHistoryPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/** Snapshots from each POST `/user/schedule` (newest first), paginated. */
const getScheduleHistoryService = async (
  userId: string,
  query: { page?: unknown; limit?: unknown }
): Promise<{
  items: Array<{
    id: string;
    userId: string;
    schedule: unknown[];
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: ScheduleHistoryPagination;
}> => {
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user id");
    }
    const limit = parseScheduleHistoryLimit(query.limit);
    let page = parseScheduleHistoryPage(query.page);

    const oid = new mongoose.Types.ObjectId(userId);
    const filter = { userId: oid };

    const total = await scheduleHistoryModel.countDocuments(filter);
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    if (totalPages > 0) {
      page = Math.min(Math.max(1, page), totalPages);
    } else {
      page = 1;
    }
    const skip = (page - 1) * limit;

    const rows = await scheduleHistoryModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const items = rows.map((doc) => {
      const row = doc as typeof doc & { createdAt?: Date; updatedAt?: Date };
      return {
        id: String(row._id),
        userId: String(row.userId),
        schedule: Array.isArray(row.schedule) ? row.schedule : [],
        createdAt:
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : String(row.createdAt ?? ""),
        updatedAt:
          row.updatedAt instanceof Date
            ? row.updatedAt.toISOString()
            : String(row.updatedAt ?? "")
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error while fetching schedule history");
  }
};

export {
  updateCompetitionService,
  scheduleTimeTableService,
  updateUserScheduleService,
  patchScheduleSessionsCompletionService,
  getActivePlanService,
  getTodayPlanService,
  checkDeadlineService,
  getScheduleHistoryService
};
