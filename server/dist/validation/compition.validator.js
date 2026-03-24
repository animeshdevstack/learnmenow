"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompetionValidation = exports.createCompetionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createCompetionValidation = joi_1.default.object({
    Name: joi_1.default.string().required(),
    Desciption: joi_1.default.string()
});
exports.createCompetionValidation = createCompetionValidation;
const updateCompetionValidation = joi_1.default.object({
    Name: joi_1.default.string(),
    Desciption: joi_1.default.string()
});
exports.updateCompetionValidation = updateCompetionValidation;
//# sourceMappingURL=compition.validator.js.map