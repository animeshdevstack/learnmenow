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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdminService = exports.loginAdminService = void 0;
const jwt_handler_1 = require("../helper/jwt-handler");
const admin_model_1 = __importDefault(require("../model/admin.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_validation_1 = require("../validation/admin.validation");
const loginAdminService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield admin_model_1.default.findOne({ email });
        if (!admin) {
            return { success: false, message: "Admin not found", token: null };
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return { success: false, message: "Invalid password", token: null };
        }
        return { success: true, message: "Admin logged in successfully", token: (0, jwt_handler_1.generateToken)({ id: admin._id, role: admin.role, email }, "7d") };
    }
    catch (error) {
        return { success: false, message: "Admin not found", error: error, token: null };
    }
});
exports.loginAdminService = loginAdminService;
const registerAdminService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = admin_validation_1.createAdminValidation.validate({ email, password });
        if (error) {
            return { success: false, message: error.message };
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const admin = yield admin_model_1.default.create({ email, password: hashedPassword || undefined });
        if (!admin) {
            return { success: false, message: "Admin not created" };
        }
        return { success: true, message: "Admin created successfully" };
    }
    catch (error) {
        console.log("erorr====", error);
        return { success: false, message: "Admin not created", error: error };
    }
});
exports.registerAdminService = registerAdminService;
//# sourceMappingURL=admin-auth.service.js.map