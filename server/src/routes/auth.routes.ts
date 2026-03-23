import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/login", loginAdmin);
authRouter.post("/register", registerAdmin);

export default authRouter;