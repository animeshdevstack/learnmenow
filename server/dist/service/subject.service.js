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
exports.getAllSubjectByCompitionIdService = exports.deletedSubjectService = exports.updateSubjectService = exports.getByIdSubjectService = exports.getAllSubjectService = exports.createSubjectService = void 0;
const subject_model_1 = __importDefault(require("../model/subject.model"));
const subject_validator_1 = require("../validation/subject.validator");
const createSubjectService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ Name, Duration, Priority, competionId }) {
    try {
        if (!Name || !Duration || !Priority || !competionId)
            throw new Error("All fields are reauired!");
        const { error } = subject_validator_1.createSubjectValidation.validate({ Name, Duration, Priority, competionId });
        if (error)
            throw new Error("Invalid input");
        const createSubject = new subject_model_1.default({ Name, Duration, Priority, competionId });
        yield createSubject.save();
        return {
            Name: createSubject.Name,
            Duration: createSubject.Duration,
            Priority: createSubject.Priority,
            competionId: createSubject.competionId,
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.createSubjectService = createSubjectService;
const getAllSubjectService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCompetion = yield subject_model_1.default.find();
        return allCompetion.map(data => ({
            id: data._id,
            Name: data.Name,
            Duration: data.Duration,
            Priority: data.Priority,
            competionId: data.competionId
        }));
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.getAllSubjectService = getAllSubjectService;
const getByIdSubjectService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Competion id is required!");
    const getCompetion = yield subject_model_1.default.findById(id);
    if (!getCompetion)
        throw new Error("Invalid id or competion is deleted!");
    return {
        id: getCompetion._id,
        Name: getCompetion.Name,
        Duration: getCompetion.Duration,
        Priority: getCompetion.Priority,
        competionId: getCompetion.competionId,
    };
});
exports.getByIdSubjectService = getByIdSubjectService;
const updateSubjectService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required!");
    const { error } = subject_validator_1.updateSubjectValidation.validate(data);
    if (error)
        throw new Error("Invalid input");
    const updatedCompetion = yield subject_model_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!updatedCompetion)
        throw new Error("No Competion is there whith provided id.");
    return {
        Name: updatedCompetion.Name,
        Duration: updatedCompetion.Duration,
        Priority: updatedCompetion.Priority,
        competionId: updatedCompetion.competionId,
    };
});
exports.updateSubjectService = updateSubjectService;
const deletedSubjectService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required!");
    const deleteCompetion = yield subject_model_1.default.findByIdAndDelete(id);
    if (!deleteCompetion)
        throw new Error("Competion not found or competion already deletd!");
    return !!deleteCompetion;
});
exports.deletedSubjectService = deletedSubjectService;
const getAllSubjectByCompitionIdService = (competionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!competionId)
        throw new Error("Competion id is required!");
    try {
        const subjects = yield subject_model_1.default.find({ competionId });
        return subjects.map(data => ({
            id: data._id,
            Name: data.Name,
            Duration: data.Duration,
            Priority: data.Priority,
            competionId: data.competionId
        }));
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.getAllSubjectByCompitionIdService = getAllSubjectByCompitionIdService;
//# sourceMappingURL=subject.service.js.map