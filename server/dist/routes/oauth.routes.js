"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauth_controller_1 = require("../controller/oauth.controller");
const oAuthRouter = (0, express_1.Router)();
// Google OAuth routes
oAuthRouter.get("/google", oauth_controller_1.googleAuth);
oAuthRouter.get("/google/callback", oauth_controller_1.googleCallback);
oAuthRouter.get("/google/signup", oauth_controller_1.googleSignUp);
oAuthRouter.get("/google/signup/callback", oauth_controller_1.googleSignUpCallback);
exports.default = oAuthRouter;
//# sourceMappingURL=oauth.routes.js.map