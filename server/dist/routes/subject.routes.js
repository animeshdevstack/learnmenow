"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_controller_1 = require("../controller/subject.controller");
const auth_handler_1 = require("../helper/auth-handler");
const subjectRoute = (0, express_1.Router)();
subjectRoute.route("/").get(auth_handler_1.authMiddleware, subject_controller_1.getAllSubject).post(auth_handler_1.adminMiddleware, subject_controller_1.createSubject);
subjectRoute
    .route("/:id")
    .get(auth_handler_1.authMiddleware, subject_controller_1.getByIdSubject)
    .put(auth_handler_1.adminMiddleware, subject_controller_1.updateSubject)
    .delete(auth_handler_1.adminMiddleware, subject_controller_1.deleteSubject);
/** Adds the filter route based on the compition - the subject will comes */
subjectRoute.route("/filter/compition/:id").get(auth_handler_1.authMiddleware, subject_controller_1.getAllSubjectByCompition);
exports.default = subjectRoute;
//# sourceMappingURL=subject.routes.js.map