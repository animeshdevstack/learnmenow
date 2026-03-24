"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const configuration_1 = __importDefault(require("./config/configuration"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const connection_1 = __importDefault(require("./libs/connection"));
const error_handler_1 = require("./helper/error-handler");
const competion_routes_1 = __importDefault(require("./routes/competion.routes"));
const subject_routes_1 = __importDefault(require("./routes/subject.routes"));
const chapter_routes_1 = __importDefault(require("./routes/chapter.routes"));
const topic_routes_1 = __importDefault(require("./routes/topic.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cors_1 = __importDefault(require("cors"));
const oauth_routes_1 = __importDefault(require("./routes/oauth.routes"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
const PORT = configuration_1.default.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://www.localhost.com:5173",
        "http://127.0.0.1:5173",
        "https://learnmenow-hph9nbuzg-animeshdevstack-3296s-projects.vercel.app/",
        "https://learnmenow.vercel.app",
    ],
    credentials: true,
}));
// Session configuration for Passport.js
app.use((0, express_session_1.default)({
    secret: configuration_1.default.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));
// Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get("/", (req, res) => {
    res.json("App is working....");
});
// Test OAuth routes
app.get("/test-oauth", (req, res) => {
    res.json({
        message: "OAuth routes are working",
        signinUrl: "http://localhost:8080/oauth/google",
        signupUrl: "http://localhost:8080/oauth/google/signup",
        signinCallback: configuration_1.default.GOOGLE_CALLBACK_URL,
        signupCallback: configuration_1.default.GOOGLE_SIGNUP_CALLBACK_URL,
        directRoutes: {
            signin: "/oauth/google",
            signup: "/oauth/google/signup",
            signinCallback: "/oauth/google/callback",
            signupCallback: "/oauth/google/signup/callback"
        }
    });
});
// Direct OAuth routes for Google OAuth (without base URL prefix)
app.use("/oauth", oauth_routes_1.default);
app.use(`${configuration_1.default.BASE_URL}/auth`, auth_routes_1.default);
app.use(`${configuration_1.default.BASE_URL}/oauth`, oauth_routes_1.default);
app.use(`${configuration_1.default.BASE_URL}/user`, user_router_1.default);
app.use(`${configuration_1.default.BASE_URL}/competition`, competion_routes_1.default);
app.use(`${configuration_1.default.BASE_URL}/subject`, subject_routes_1.default);
app.use(`${configuration_1.default.BASE_URL}/chapter`, chapter_routes_1.default);
app.use(`${configuration_1.default.BASE_URL}/topic`, topic_routes_1.default);
app.use(error_handler_1.errorHandler);
void (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connection_1.default)();
        app.listen(PORT, () => {
            console.log(`App is working in port: ${PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to connect to database — exiting.", err);
        process.exit(1);
    }
}))();
//# sourceMappingURL=index.js.map