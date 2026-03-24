"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topic_controller_1 = require("../controller/topic.controller");
const auth_handler_1 = require("../helper/auth-handler");
const topicRouter = (0, express_1.Router)();
topicRouter.route("/").get(auth_handler_1.authMiddleware, topic_controller_1.getAllTopic).post(auth_handler_1.adminMiddleware, topic_controller_1.createTopic);
topicRouter
    .route("/:id")
    .get(auth_handler_1.authMiddleware, topic_controller_1.getByIdTopic)
    .put(auth_handler_1.adminMiddleware, topic_controller_1.updateTopic)
    .delete(auth_handler_1.adminMiddleware, topic_controller_1.deleteTopic);
/** Adds the filter route based on the compition - the subject will comes */
topicRouter.route("/filter/chapter/:id").get(auth_handler_1.authMiddleware, topic_controller_1.getAllTopicByChapterId);
exports.default = topicRouter;
//# sourceMappingURL=topic.routes.js.map