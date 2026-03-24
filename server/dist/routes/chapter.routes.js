"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chapter_controller_1 = require("../controller/chapter.controller");
const auth_handler_1 = require("../helper/auth-handler");
const chapterRouter = (0, express_1.Router)();
chapterRouter.route("/").get(auth_handler_1.authMiddleware, chapter_controller_1.getAllChapter).post(auth_handler_1.adminMiddleware, chapter_controller_1.createChapter);
chapterRouter
    .route("/:id")
    .get(auth_handler_1.authMiddleware, chapter_controller_1.getByIdChapter)
    .put(auth_handler_1.adminMiddleware, chapter_controller_1.updateChapter)
    .delete(auth_handler_1.adminMiddleware, chapter_controller_1.deleteChapter);
/** Adds the filter route based on the compition - the subject will comes */
chapterRouter.route("/filter/subject/:id").get(auth_handler_1.authMiddleware, chapter_controller_1.getAllChapterBySubjectId);
exports.default = chapterRouter;
//# sourceMappingURL=chapter.routes.js.map