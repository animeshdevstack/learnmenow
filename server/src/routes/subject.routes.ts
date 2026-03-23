/** @format */

import { Router } from "express";
import {
  createSubject,
  getAllSubject,
  getByIdSubject,
  updateSubject,
  deleteSubject,
  getAllSubjectByCompition,
} from "../controller/subject.controller";
import { adminMiddleware, authMiddleware } from "../helper/auth-handler";

const subjectRoute = Router();

subjectRoute.route("/").get(authMiddleware, getAllSubject).post(adminMiddleware, createSubject);
subjectRoute
  .route("/:id")
  .get(authMiddleware, getByIdSubject)
  .put(adminMiddleware, updateSubject)
  .delete(adminMiddleware, deleteSubject);

/** Adds the filter route based on the compition - the subject will comes */
subjectRoute.route("/filter/compition/:id").get(authMiddleware, getAllSubjectByCompition);



export default subjectRoute;
