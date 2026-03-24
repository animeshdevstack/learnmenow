"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTopicValidation = exports.createTopicValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createTopicValidation = joi_1.default.object({
    Name: joi_1.default.string().required(),
    Duration: joi_1.default.number().required(),
    Priority: joi_1.default.number().required(),
    chapterId: joi_1.default.string().required(),
});
exports.createTopicValidation = createTopicValidation;
const updateTopicValidation = joi_1.default.object({
    Name: joi_1.default.string(),
    Duration: joi_1.default.number(),
    Priority: joi_1.default.number(),
    chapterId: joi_1.default.string(),
});
exports.updateTopicValidation = updateTopicValidation;
//# sourceMappingURL=topic.validator.js.map