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
exports.getAllSubjectByCompition = exports.deleteSubject = exports.updateSubject = exports.getByIdSubject = exports.getAllSubject = exports.createSubject = void 0;
const subject_service_1 = require("../service/subject.service");
const createSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, Duration, Priority, competionId } = req.body;
        const subjectData = yield (0, subject_service_1.createSubjectService)({ Name, Duration, Priority, competionId });
        return res.status(201).json({
            success: true,
            message: "subject created successfully.",
            subjectData
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createSubject = createSubject;
const getAllSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allsubject = yield (0, subject_service_1.getAllSubjectService)();
        return res.status(200).json({
            success: true,
            message: "All subject fetch successfully",
            allsubject
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSubject = getAllSubject;
const getByIdSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getSubject = yield (0, subject_service_1.getByIdSubjectService)(id);
        return res.status(200).json({
            success: true,
            message: "successfully get the subject",
            getSubject
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getByIdSubject = getByIdSubject;
const updateSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedSubject = yield (0, subject_service_1.updateSubjectService)(id, req.body);
        return res.status(200).json({
            success: true,
            message: "successfully update the subject",
            updatedSubject
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateSubject = updateSubject;
const deleteSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedSubject = yield (0, subject_service_1.deletedSubjectService)(id);
        return res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
            deletedSubject
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSubject = deleteSubject;
const getAllSubjectByCompition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const allsubject = yield (0, subject_service_1.getAllSubjectByCompitionIdService)(id);
        return res.status(200).json({
            success: true,
            message: "All subject fetch successfully",
            allsubject
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSubjectByCompition = getAllSubjectByCompition;
//# sourceMappingURL=subject.controller.js.map