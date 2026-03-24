"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserScheduleService = exports.scheduleTimeTableService = exports.updateCompetitionService = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const routine_repository_1 = require("../repositories/routine.repository");
const userSchedule_model_1 = __importDefault(require("../model/userSchedule.model"));
const MINUTES_PER_DAY = 24 * 60;
const SCHEDULE_SLOT_VALUES = [
    "morning",
    "afternoon",
    "evening",
    "night",
    "late_night"
];
/** Legacy API values still accepted for older clients. */
const LEGACY_PREFERRED_SLOT_MAP = {
    morning: "morning",
    evening: "evening",
    night: "night"
};
/**
 * Clock windows (minutes from midnight, end exclusive).
 * late_night has two segments: end of day 23:00–24:00 and early 00:00–05:00.
 */
const slotSegments = (slot) => {
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
const normalizePreferredSlot = (raw) => {
    const key = String(raw).toLowerCase().trim();
    if (SCHEDULE_SLOT_VALUES.includes(key)) {
        return key;
    }
    if (LEGACY_PREFERRED_SLOT_MAP[key]) {
        return LEGACY_PREFERRED_SLOT_MAP[key];
    }
    throw new Error("preferredSlot must be morning, afternoon, evening, night or late_night");
};
/**
 * Resolves `preferredSlots` array or legacy single `preferredSlot` string.
 * Dedupes while preserving first-seen order.
 */
const normalizePreferredSlotsInput = (data) => {
    const fromArray = data.preferredSlots;
    const legacy = data.preferredSlot;
    let rawList;
    if (Array.isArray(fromArray) && fromArray.length > 0) {
        rawList = fromArray;
    }
    else if (legacy != null && String(legacy).trim() !== "") {
        rawList = [legacy];
    }
    else {
        throw new Error("preferredSlots (non-empty array) or preferredSlot is required");
    }
    const seen = new Set();
    const out = [];
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
const pickRandomSlot = (slots) => {
    return slots[randomInt(0, slots.length)];
};
const pad2 = (n) => String(n).padStart(2, "0");
const minutesToHHMM = (minutesFromMidnight) => {
    const m = ((minutesFromMidnight % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${pad2(h)}:${pad2(min)}`;
};
const addDaysIso = (dateStr, days) => {
    const d = new Date(`${dateStr}T12:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split("T")[0];
};
const randomInt = (minInclusive, maxExclusive) => {
    if (maxExclusive <= minInclusive)
        return minInclusive;
    return minInclusive + Math.floor(Math.random() * (maxExclusive - minInclusive));
};
const SLOT_CLOCK_RANGE_LABEL = {
    morning: "05:00–12:00",
    afternoon: "12:00–17:00",
    evening: "17:00–21:00",
    night: "21:00–23:00",
    late_night: "23:00–24:00 or 00:00–05:00 (one segment per day, chosen at random)"
};
/**
 * Places sessions back-to-back from a random start inside the chosen slot window.
 * If total duration exceeds the window, times extend past the slot (overflow).
 * late_night: one segment is chosen at random for that day (23:00–24:00 or 00:00–05:00).
 */
const assignClockTimesToDaySessions = (dayDate, sessions, slot) => {
    if (sessions.length === 0) {
        return { timed: [], overflowPastSlot: false };
    }
    const segments = slotSegments(slot);
    const seg = slot === "late_night"
        ? segments[randomInt(0, segments.length)]
        : segments[0];
    const windowLen = seg.end - seg.start;
    const totalDur = sessions.reduce((s, x) => s + x.durationMinutes, 0);
    let maxOffset = windowLen - totalDur;
    if (maxOffset < 0)
        maxOffset = 0;
    const offset = randomInt(0, maxOffset + 1);
    let cursor = seg.start + offset;
    const timed = [];
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
        timed.push(Object.assign(Object.assign({}, sess), { preferredSlot: slot, startTime,
            endTime,
            startDate,
            endDate, spansNextDay: endDate !== startDate, isCompleted: false }));
        cursor = endAbs;
    }
    return { timed, overflowPastSlot };
};
const updateCompetitionService = (userId, CompetitionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.isValidObjectId(userId))
            throw new Error("Invalid user id");
        if (!mongoose_1.default.isValidObjectId(CompetitionId))
            throw new Error("Invalid competition id");
        const user = yield user_model_1.default.findById(userId);
        if (!user)
            throw new Error("No user found with the provided userId");
        user.CompetitionId = new mongoose_1.default.Types.ObjectId(CompetitionId);
        yield user.save();
        return {
            FName: user.FName || undefined,
            LName: user.LName || undefined,
            Phone: user.Phone ? Number(user.Phone) : undefined,
            Email: user.Email || undefined,
            Role: user.Role || undefined,
            CompetitionId: user.CompetitionId || undefined,
            _id: user._id.toString(),
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error while updating the competition");
    }
});
exports.updateCompetitionService = updateCompetitionService;
const scheduleTimeTableService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.isValidObjectId(userId)) {
            throw new Error("Invalid user id");
        }
        const { startDate, deadline, studyTime, selectedTopics } = data;
        if (!startDate || !deadline || !studyTime) {
            throw new Error("startDate, deadline and studyTime are required");
        }
        const resolvedSlots = normalizePreferredSlotsInput(data);
        if (typeof studyTime.weekdays !== "number" ||
            typeof studyTime.weekends !== "number") {
            throw new Error("studyTime.weekdays and studyTime.weekends must be numbers");
        }
        if (studyTime.weekdays < 0 ||
            studyTime.weekends < 0 ||
            !Number.isFinite(studyTime.weekdays) ||
            !Number.isFinite(studyTime.weekends)) {
            throw new Error("studyTime.weekdays and studyTime.weekends must be non-negative finite numbers");
        }
        if (!Array.isArray(selectedTopics) || selectedTopics.length === 0) {
            throw new Error("selectedTopics is required");
        }
        for (const item of selectedTopics) {
            if (!item.topicId) {
                throw new Error("Each selected topic must have topicId");
            }
            if (!mongoose_1.default.isValidObjectId(item.topicId)) {
                throw new Error(`Invalid topic id: ${item.topicId}`);
            }
            if (item.priority !== undefined) {
                if (typeof item.priority !== "number" ||
                    item.priority < 1 ||
                    item.priority > 5) {
                    throw new Error("Priority must be a number between 1 and 5");
                }
            }
        }
        const user = yield user_model_1.default.findById(userId).lean();
        if (!user) {
            throw new Error("No user found with the provided user id");
        }
        if (!user.CompetitionId) {
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
        const days = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const current = new Date(d);
            const day = current.getDay();
            const isWeekend = day === 0 || day === 6;
            const availableMinutes = isWeekend
                ? Number(studyTime.weekends) * 60
                : Number(studyTime.weekdays) * 60;
            if (isWeekend)
                weekendCount++;
            else
                weekdayCount++;
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
        const topicDocs = yield (0, routine_repository_1.getTopicsWithChapterAndSubject)(selectedTopics.map((item) => item.topicId), String(user.CompetitionId));
        const topicMap = new Map(topicDocs.map((item) => [String(item._id), item]));
        const resolvedTopics = selectedTopics.map((selectedTopic) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const topic = topicMap.get(selectedTopic.topicId);
            if (!topic) {
                throw new Error(`Topic not found or does not belong to user's competition: ${selectedTopic.topicId}`);
            }
            const chapter = topic.chapter || null;
            const subject = topic.subject || null;
            const userPriority = (_a = selectedTopic.priority) !== null && _a !== void 0 ? _a : 1;
            const adminTopicPriority = Number((_b = topic.Priority) !== null && _b !== void 0 ? _b : 0);
            const adminChapterPriority = Number((_c = chapter === null || chapter === void 0 ? void 0 : chapter.Priority) !== null && _c !== void 0 ? _c : 0);
            const adminSubjectPriority = Number((_d = subject === null || subject === void 0 ? void 0 : subject.Priority) !== null && _d !== void 0 ? _d : 0);
            const adminPriority = adminTopicPriority ||
                adminChapterPriority ||
                adminSubjectPriority ||
                0;
            // Duration is treated as MAX duration only
            const maxDurationMinutes = Number((_e = topic.Duration) !== null && _e !== void 0 ? _e : 0) ||
                Number((_f = chapter === null || chapter === void 0 ? void 0 : chapter.Duration) !== null && _f !== void 0 ? _f : 0) ||
                Number((_g = subject === null || subject === void 0 ? void 0 : subject.Duration) !== null && _g !== void 0 ? _g : 0) ||
                60;
            return {
                topicId: String(topic._id),
                topicName: topic.Name,
                chapterName: (chapter === null || chapter === void 0 ? void 0 : chapter.Name) || null,
                subjectName: (subject === null || subject === void 0 ? void 0 : subject.Name) || null,
                userPriority,
                adminPriority,
                adminTopicPriority,
                adminChapterPriority,
                adminSubjectPriority,
                maxDurationMinutes,
                finalWeight: userPriority * 100 + adminPriority
            };
        });
        const totalWeight = resolvedTopics.reduce((sum, item) => sum + item.finalWeight, 0);
        let allocatedTopics = resolvedTopics.map((item) => {
            const rawAllocatedMinutes = totalWeight > 0
                ? Math.round((item.finalWeight / totalWeight) * totalAvailableMinutes)
                : 0;
            return Object.assign(Object.assign({}, item), { rawAllocatedMinutes, allocatedMinutes: Math.min(rawAllocatedMinutes, item.maxDurationMinutes) });
        });
        // Remove topics with 0 allocated time
        allocatedTopics = allocatedTopics.filter((item) => item.allocatedMinutes > 0);
        // Sort topics:
        // 1. userPriority desc
        // 2. adminTopicPriority desc
        // 3. adminChapterPriority desc
        // 4. adminSubjectPriority desc
        allocatedTopics.sort((a, b) => {
            if (b.userPriority !== a.userPriority)
                return b.userPriority - a.userPriority;
            if (b.adminTopicPriority !== a.adminTopicPriority) {
                return b.adminTopicPriority - a.adminTopicPriority;
            }
            if (b.adminChapterPriority !== a.adminChapterPriority) {
                return b.adminChapterPriority - a.adminChapterPriority;
            }
            return b.adminSubjectPriority - a.adminSubjectPriority;
        });
        const getSessionLength = (priority) => {
            if (priority === 5)
                return 90;
            if (priority === 4)
                return 75;
            if (priority === 3)
                return 60;
            if (priority === 2)
                return 45;
            return 30;
        };
        const sessionPool = [];
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
                    preferredSlot: resolvedSlots[0]
                });
                remaining -= currentSession;
            }
        }
        const schedule = [];
        let sessionPointer = 0;
        for (const day of days) {
            let remainingMinutes = day.availableMinutes;
            const sessions = [];
            while (sessionPointer < sessionPool.length) {
                const nextSession = sessionPool[sessionPointer];
                if (nextSession.durationMinutes <= remainingMinutes) {
                    sessions.push(nextSession);
                    remainingMinutes -= nextSession.durationMinutes;
                    sessionPointer++;
                }
                else {
                    break;
                }
            }
            if (sessions.length === 0) {
                continue;
            }
            const daySlot = pickRandomSlot(resolvedSlots);
            const { timed, overflowPastSlot } = assignClockTimesToDaySessions(day.date, sessions, daySlot);
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
        const totalScheduledMinutes = allocatedTopics.reduce((sum, item) => sum + item.allocatedMinutes, 0);
        const summary = {
            startDate,
            deadline,
            preferredSlots: resolvedSlots,
            preferredSlot: resolvedSlots[0],
            slotClockRange: resolvedSlots.length === 1
                ? SLOT_CLOCK_RANGE_LABEL[resolvedSlots[0]]
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
        const saved = yield userSchedule_model_1.default.findOneAndUpdate({ userId: new mongoose_1.default.Types.ObjectId(userId) }, {
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
        }, { upsert: true, new: true, runValidators: true });
        return {
            scheduleId: String(saved._id),
            summary,
            topics,
            schedule
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error while scheduling the time table");
    }
});
exports.scheduleTimeTableService = scheduleTimeTableService;
const UPDATE_SCHEDULE_KEYS = [
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
const updateUserScheduleService = (userId, scheduleId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.isValidObjectId(userId)) {
            throw new Error("Invalid user id");
        }
        if (!mongoose_1.default.isValidObjectId(scheduleId)) {
            throw new Error("Invalid schedule id");
        }
        const $set = {};
        for (const key of UPDATE_SCHEDULE_KEYS) {
            const value = data[key];
            if (value !== undefined) {
                $set[key] = value;
            }
        }
        if (Object.keys($set).length === 0) {
            throw new Error("No updatable fields provided. Send one or more of: summary, topics, schedule, selectedTopics, totalTime, startDate, deadline, preferredSlots, studyTime");
        }
        const updated = yield userSchedule_model_1.default.findOneAndUpdate({
            _id: new mongoose_1.default.Types.ObjectId(scheduleId),
            userId: new mongoose_1.default.Types.ObjectId(userId)
        }, { $set }, { new: true, runValidators: true });
        if (!updated) {
            throw new Error("Schedule not found or you do not have permission to update it.");
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
    }
    catch (error) {
        throw new Error(error.message || "Internal server error while updating the schedule");
    }
});
exports.updateUserScheduleService = updateUserScheduleService;
//# sourceMappingURL=user-competition.service.js.map