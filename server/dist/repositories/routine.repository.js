"use strict";
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
exports.getTopicsWithChapterAndSubject = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const topic_model_1 = __importDefault(require("../model/topic.model"));
const getTopicsWithChapterAndSubject = (topicIds, competitionId) => __awaiter(void 0, void 0, void 0, function* () {
    const topicObjectIds = topicIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
    return topic_model_1.default.aggregate([
        {
            $match: {
                _id: { $in: topicObjectIds }
            }
        },
        {
            $lookup: {
                from: "chapters",
                localField: "chapterId",
                foreignField: "_id",
                as: "chapter"
            }
        },
        {
            $unwind: {
                path: "$chapter",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "subjects",
                localField: "chapter.subjectId",
                foreignField: "_id",
                as: "subject"
            }
        },
        {
            $unwind: {
                path: "$subject",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                "subject.competionId": new mongoose_1.default.Types.ObjectId(competitionId)
            }
        },
        {
            $project: {
                _id: 1,
                Name: 1,
                Duration: 1,
                Priority: 1,
                chapterId: 1,
                "chapter._id": 1,
                "chapter.Name": 1,
                "chapter.Duration": 1,
                "chapter.Priority": 1,
                "chapter.subjectId": 1,
                "subject._id": 1,
                "subject.Name": 1,
                "subject.Duration": 1,
                "subject.Priority": 1,
                "subject.competionId": 1
            }
        }
    ]);
});
exports.getTopicsWithChapterAndSubject = getTopicsWithChapterAndSubject;
//# sourceMappingURL=routine.repository.js.map