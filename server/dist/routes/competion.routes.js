"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const competion_controller_1 = require("../controller/competion.controller");
const auth_handler_1 = require("../helper/auth-handler");
const competionRouter = (0, express_1.Router)();
competionRouter.route("/").get(auth_handler_1.authMiddleware, competion_controller_1.getAllCompetition).post(auth_handler_1.adminMiddleware, competion_controller_1.createCompetition);
competionRouter
    .route("/:id")
    .get(auth_handler_1.authMiddleware, competion_controller_1.getByIdCompetition)
    .put(auth_handler_1.adminMiddleware, competion_controller_1.updateCompetition)
    .delete(auth_handler_1.adminMiddleware, competion_controller_1.deleteCompetition);
exports.default = competionRouter;
//# sourceMappingURL=competion.routes.js.map