/** @format */

import { Router } from "express";
import {
  createChapter,
  getAllChapter,
  getByIdChapter,
  updateChapter,
  deleteChapter,
  getAllChapterBySubjectId,
} from "../controller/chapter.controller";
import { adminMiddleware, authMiddleware } from "../helper/auth-handler";

const chapterRouter = Router();

chapterRouter.route("/").get(authMiddleware, getAllChapter).post(adminMiddleware, createChapter);
chapterRouter
  .route("/:id")
  .get(authMiddleware, getByIdChapter)
  .put(adminMiddleware, updateChapter)
  .delete(adminMiddleware, deleteChapter);

/** Adds the filter route based on the compition - the subject will comes */
chapterRouter.route("/filter/subject/:id").get(authMiddleware, getAllChapterBySubjectId);

export default chapterRouter;
