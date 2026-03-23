/** @format */

import { Router } from "express";
import {
  createCompetition,
  getAllCompetition,
  getByIdCompetition,
  updateCompetition,
  deleteCompetition,
} from "../controller/competion.controller";
import { adminMiddleware, authMiddleware } from "../helper/auth-handler";

const competionRouter = Router();

competionRouter.route("/").get(authMiddleware, getAllCompetition).post(adminMiddleware, createCompetition);
competionRouter
  .route("/:id")
  .get(authMiddleware, getByIdCompetition)
  .put(adminMiddleware, updateCompetition)
  .delete(adminMiddleware, deleteCompetition);

export default competionRouter;
