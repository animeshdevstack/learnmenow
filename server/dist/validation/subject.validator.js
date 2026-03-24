"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubjectValidation = exports.createSubjectValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createSubjectValidation = joi_1.default.object({
    Name: joi_1.default.string().required(),
    Duration: joi_1.default.number().required(),
    Priority: joi_1.default.number().required(),
    competionId: joi_1.default.string().required(),
});
exports.createSubjectValidation = createSubjectValidation;
const updateSubjectValidation = joi_1.default.object({
    Name: joi_1.default.string(),
    Duration: joi_1.default.number(),
    Priority: joi_1.default.number(),
    competionId: joi_1.default.string(),
});
exports.updateSubjectValidation = updateSubjectValidation;
//# sourceMappingURL=subject.validator.js.map