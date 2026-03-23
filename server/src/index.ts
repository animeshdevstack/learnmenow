import express, { Request, Response} from "express";
import configuration from "./config/configuration";
import userRouter from "./routes/user.router";
import Connection from "./libs/connection";
import { errorHandler } from "./helper/error-handler";
import competionRouter from "./routes/competion.routes";
import subjectRoute from "./routes/subject.routes";
import chapterRouter from "./routes/chapter.routes";
import topicRouter from "./routes/topic.routes";
import authRouter from "./routes/auth.routes";
import cors from "cors";
import oAuthRouter from "./routes/oauth.routes";
import session from "express-session";
import passport from "passport";

const app = express();

const PORT = configuration.PORT;

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://www.localhost.com:5173",
        "http://127.0.0.1:5173",
        "https://learnmenow-hph9nbuzg-animeshdevstack-3296s-projects.vercel.app/"
    ],
    credentials: true,
}));

// Session configuration for Passport.js
app.use(session({
    secret: configuration.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
    res.json("App is working....");
});

// Test OAuth routes
app.get("/test-oauth", (req: Request, res: Response) => {
    res.json({
        message: "OAuth routes are working",
        signinUrl: "http://localhost:8080/oauth/google",
        signupUrl: "http://localhost:8080/oauth/google/signup",
        signinCallback: configuration.GOOGLE_CALLBACK_URL,
        signupCallback: configuration.GOOGLE_SIGNUP_CALLBACK_URL,
        directRoutes: {
            signin: "/oauth/google",
            signup: "/oauth/google/signup",
            signinCallback: "/oauth/google/callback",
            signupCallback: "/oauth/google/signup/callback"
        }
    });
});

// Direct OAuth routes for Google OAuth (without base URL prefix)
app.use("/oauth", oAuthRouter);

app.use(`${configuration.BASE_URL}/auth`, authRouter);
app.use(`${configuration.BASE_URL}/oauth`, oAuthRouter);
app.use(`${configuration.BASE_URL}/user`, userRouter);
app.use(`${configuration.BASE_URL}/competition`, competionRouter);
app.use(`${configuration.BASE_URL}/subject`, subjectRoute);
app.use(`${configuration.BASE_URL}/chapter`, chapterRouter);
app.use(`${configuration.BASE_URL}/topic`, topicRouter);

app.use(errorHandler);

app.listen(PORT, ()=>{
    Connection();
    console.log(`App is working in port: ${PORT}`);
});
