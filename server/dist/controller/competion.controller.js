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
exports.deleteCompetition = exports.updateCompetition = exports.getByIdCompetition = exports.getAllCompetition = exports.createCompetition = void 0;
const compition_service_1 = require("../service/compition.service");
const createCompetition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, Desciption } = req.body;
        const compititonName = yield (0, compition_service_1.createCompitionService)(Name, Desciption);
        return res.status(201).json({
            success: true,
            message: "Competion created successfully.",
            compititonName
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createCompetition = createCompetition;
const getAllCompetition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCompetion = yield (0, compition_service_1.getAllCompetionService)();
        return res.status(200).json({
            success: true,
            message: "All competion exams fetch successfully",
            allCompetion
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCompetition = getAllCompetition;
const getByIdCompetition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getCompetion = yield (0, compition_service_1.getByIdCompitionService)(id);
        return res.status(200).json({
            success: true,
            message: "successfully get the competion",
            getCompetion
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getByIdCompetition = getByIdCompetition;
const updateCompetition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedCompition = yield (0, compition_service_1.updateCompetionService)(id, req.body);
        return res.status(200).json({
            success: true,
            message: "successfully update the competion",
            updatedCompition
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateCompetition = updateCompetition;
const deleteCompetition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedCompetion = yield (0, compition_service_1.deletedCompetionService)(id);
        return res.status(200).json({
            success: true,
            message: "Competion deleted successfully",
            deletedCompetion
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCompetition = deleteCompetition;
//# sourceMappingURL=competion.controller.js.map