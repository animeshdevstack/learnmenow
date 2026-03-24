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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChapterBySubjectId = exports.deleteChapter = exports.updateChapter = exports.getByIdChapter = exports.getAllChapter = exports.createChapter = void 0;
const chapter_service_1 = require("../service/chapter.service");
const createChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, Duration, Priority, subjectId } = req.body;
        const chapterData = yield (0, chapter_service_1.createChapterService)({ Name, Duration, Priority, subjectId });
        return res.status(201).json({
            success: true,
            message: "Chapter created successfully.",
            chapterData
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createChapter = createChapter;
const getAllChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allChapter = yield (0, chapter_service_1.getAllChapterService)();
        return res.status(200).json({
            success: true,
            message: "All chapter fetch successfully",
            allChapter
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllChapter = getAllChapter;
const getByIdChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getChapter = yield (0, chapter_service_1.getByIdChapterService)(id);
        return res.status(200).json({
            success: true,
            message: "successfully get the chapter",
            getChapter
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getByIdChapter = getByIdChapter;
const updateChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedChapter = yield (0, chapter_service_1.updateChapterService)(id, req.body);
        return res.status(200).json({
            success: true,
            message: "successfully update the chapter",
            updatedChapter
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateChapter = updateChapter;
const deleteChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedChapter = yield (0, chapter_service_1.deletedChapterService)(id);
        return res.status(200).json({
            success: true,
            message: "Chapter deleted successfully",
            deletedChapter
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteChapter = deleteChapter;
const getAllChapterBySubjectId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const allChapter = yield (0, chapter_service_1.getAllChapterBySubjectIdService)(id);
        return res.status(200).json({
            success: true,
            message: "All chapter fetch successfully",
            allChapter
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllChapterBySubjectId = getAllChapterBySubjectId;
//# sourceMappingURL=chapter.controller.js.map