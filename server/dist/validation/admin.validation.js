"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createAdminValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required().min(5).max(16),
});
exports.createAdminValidation = createAdminValidation;
//# sourceMappingURL=admin.validation.js.map