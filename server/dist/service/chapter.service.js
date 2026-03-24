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
exports.getAllChapterBySubjectIdService = exports.deletedChapterService = exports.updateChapterService = exports.getByIdChapterService = exports.getAllChapterService = exports.createChapterService = void 0;
const chapter_model_1 = __importDefault(require("../model/chapter.model"));
const chapter_validator_1 = require("../validation/chapter.validator");
const createChapterService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ Name, Duration, Priority, subjectId }) {
    try {
        if (!Name || !Duration || !Priority || !subjectId)
            throw new Error("All fields are reauired!");
        const { error } = chapter_validator_1.createChapterValidation.validate({ Name, Duration, Priority, subjectId });
        if (error)
            throw new Error("Invalid input");
        const createChapter = new chapter_model_1.default({ Name, Duration, Priority, subjectId });
        yield createChapter.save();
        return {
            id: createChapter._id,
            Name: createChapter.Name,
            Duration: createChapter.Duration,
            Priority: createChapter.Priority,
            subjectId: createChapter.subjectId,
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.createChapterService = createChapterService;
const getAllChapterService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allChapter = yield chapter_model_1.default.find();
        return allChapter.map(data => ({
            id: data._id,
            Name: data.Name,
            Duration: data.Duration,
            Priority: data.Priority,
            subjectId: data.subjectId
        }));
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.getAllChapterService = getAllChapterService;
const getByIdChapterService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Competion id is required!");
    const getChapter = yield chapter_model_1.default.findById(id);
    if (!getChapter)
        throw new Error("Invalid id or chapter is deleted!");
    return {
        id: getChapter._id,
        Name: getChapter.Name,
        Duration: getChapter.Duration,
        Priority: getChapter.Priority,
        subjectId: getChapter.subjectId,
    };
});
exports.getByIdChapterService = getByIdChapterService;
const updateChapterService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required!");
    const { error } = chapter_validator_1.updateChapterValidation.validate(data);
    if (error)
        throw new Error("Invalid input");
    const updatedChapter = yield chapter_model_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!updatedChapter)
        throw new Error("No Chapter is there whith provided id.");
    return {
        id: updatedChapter._id,
        Name: updatedChapter.Name,
        Duration: updatedChapter.Duration,
        Priority: updatedChapter.Priority,
        subjectId: updatedChapter.subjectId,
    };
});
exports.updateChapterService = updateChapterService;
const deletedChapterService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required!");
    const deleteChapter = yield chapter_model_1.default.findByIdAndDelete(id);
    if (!deleteChapter)
        throw new Error("Chapter not found or chapter already deletd!");
    return !!deleteChapter;
});
exports.deletedChapterService = deletedChapterService;
const getAllChapterBySubjectIdService = (subjectId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!subjectId)
        throw new Error("Subject id is required!");
    try {
        const allChapter = yield chapter_model_1.default.find({ subjectId });
        return allChapter.map(data => ({
            id: data._id,
            Name: data.Name,
            Duration: data.Duration,
            Priority: data.Priority,
            subjectId: data.subjectId
        }));
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.getAllChapterBySubjectIdService = getAllChapterBySubjectIdService;
//# sourceMappingURL=chapter.service.js.map