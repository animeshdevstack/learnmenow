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
exports.deletedCompetionService = exports.updateCompetionService = exports.getByIdCompitionService = exports.getAllCompetionService = exports.createCompitionService = void 0;
const competion_model_1 = __importDefault(require("../model/competion.model"));
const compition_validator_1 = require("../validation/compition.validator");
const createCompitionService = (Name, Desciption) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!Name)
            throw new Error("Compitition Name is reauired!");
        const { error } = compition_validator_1.createCompetionValidation.validate({ Name });
        if (error)
            throw new Error("Invalid input");
        const createCompition = new competion_model_1.default({ Name, Desciption });
        yield createCompition.save();
        return {
            id: createCompition._id.toString(),
            Name: createCompition.Name,
            Desciption: createCompition.Desciption
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.createCompitionService = createCompitionService;
const getAllCompetionService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCompetion = yield competion_model_1.default.find();
        return allCompetion.map(data => ({
            id: data._id.toString(),
            Name: data.Name,
            Desciption: data.Desciption
        }));
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.getAllCompetionService = getAllCompetionService;
const getByIdCompitionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Competion id is required!");
    const getCompetion = yield competion_model_1.default.findById(id);
    if (!getCompetion)
        throw new Error("Invalid id or competion is deleted!");
    return {
        id: getCompetion === null || getCompetion === void 0 ? void 0 : getCompetion._id.toString(),
        Name: getCompetion === null || getCompetion === void 0 ? void 0 : getCompetion.Name,
        Desciption: getCompetion === null || getCompetion === void 0 ? void 0 : getCompetion.Desciption
    };
});
exports.getByIdCompitionService = getByIdCompitionService;
const updateCompetionService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required!");
    const { error } = compition_validator_1.updateCompetionValidation.validate(data);
    if (error)
        throw new Error("Invalid input");
    const updatedCompetion = yield competion_model_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!updatedCompetion)
        throw new Error("No Competion is there whith provided id.");
    return {
        id: updatedCompetion === null || updatedCompetion === void 0 ? void 0 : updatedCompetion._id.toString(),
        Name: updatedCompetion === null || updatedCompetion === void 0 ? void 0 : updatedCompetion.Name,
        Desciption: updatedCompetion === null || updatedCompetion === void 0 ? void 0 : updatedCompetion.Desciption
    };
});
exports.updateCompetionService = updateCompetionService;
const deletedCompetionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required!");
    const deleteCompetion = yield competion_model_1.default.findByIdAndDelete(id);
    if (!deleteCompetion)
        throw new Error("Competion not found or competion already deletd!");
    return !!deleteCompetion;
});
exports.deletedCompetionService = deletedCompetionService;
//# sourceMappingURL=compition.service.js.map