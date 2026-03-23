/** @format */

import { Router } from "express";
import {
  createTopic,
  getAllTopic,
  getByIdTopic,
  updateTopic,
  deleteTopic,
  getAllTopicByChapterId,
} from "../controller/topic.controller";
import { adminMiddleware, authMiddleware } from "../helper/auth-handler";

const topicRouter = Router();

topicRouter.route("/").get(authMiddleware, getAllTopic).post(adminMiddleware, createTopic);
topicRouter
  .route("/:id")
  .get(authMiddleware, getByIdTopic)
  .put(adminMiddleware, updateTopic)
  .delete(adminMiddleware, deleteTopic);

/** Adds the filter route based on the compition - the subject will comes */
topicRouter.route("/filter/chapter/:id").get(authMiddleware, getAllTopicByChapterId);

export default topicRouter;
