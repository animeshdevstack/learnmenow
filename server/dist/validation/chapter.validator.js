"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChapterValidation = exports.createChapterValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createChapterValidation = joi_1.default.object({
    Name: joi_1.default.string().required(),
    Duration: joi_1.default.number().required(),
    Priority: joi_1.default.number().required(),
    subjectId: joi_1.default.string().required(),
});
exports.createChapterValidation = createChapterValidation;
const updateChapterValidation = joi_1.default.object({
    Name: joi_1.default.string(),
    Duration: joi_1.default.number(),
    Priority: joi_1.default.number(),
    subjectId: joi_1.default.string(),
});
exports.updateChapterValidation = updateChapterValidation;
//# sourceMappingURL=chapter.validator.js.map