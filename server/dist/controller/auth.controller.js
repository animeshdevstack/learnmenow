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
exports.registerAdmin = exports.loginAdmin = void 0;
const admin_auth_service_1 = require("../service/admin-auth.service");
const loginAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { success, message, token } = yield (0, admin_auth_service_1.loginAdminService)(email, password);
        return res.status(success ? 200 : 401).json({ message, token, success, status: success ? 200 : 401 });
    }
    catch (error) {
        next(error);
    }
});
exports.loginAdmin = loginAdmin;
const registerAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { success, message } = yield (0, admin_auth_service_1.registerAdminService)(email, password);
        return res.status(success ? 201 : 400).json({ message, success, status: success ? 201 : 400 });
    }
    catch (error) {
        next(error);
    }
});
exports.registerAdmin = registerAdmin;
//# sourceMappingURL=auth.controller.js.map