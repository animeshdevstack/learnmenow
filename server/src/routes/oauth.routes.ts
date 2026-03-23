import { Router } from "express";
import { googleAuth, googleCallback, googleSignUp, googleSignUpCallback } from "../controller/oauth.controller";

const oAuthRouter = Router();

// Google OAuth routes
oAuthRouter.get("/google", googleAuth);
oAuthRouter.get("/google/callback", googleCallback);
oAuthRouter.get("/google/signup", googleSignUp);
oAuthRouter.get("/google/signup/callback", googleSignUpCallback);

export default oAuthRouter;