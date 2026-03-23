import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import configuration from "../config/configuration";
import { googleSignInService, googleSignUpService } from "../service/oauth.service";

// Helper function to construct frontend URL without double slashes
const getFrontendUrl = (path: string, params?: Record<string, string>) => {
  const baseUrl = configuration.FRONTEND_URL.endsWith('/') 
    ? configuration.FRONTEND_URL.slice(0, -1) 
    : configuration.FRONTEND_URL;
  
  const url = `${baseUrl}${path}`;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    return `${url}?${searchParams.toString()}`;
  }
  
  return url;
};

// Configure Google OAuth Strategy for Sign-in
passport.use('google-signin', new GoogleStrategy(
  {
    clientID: configuration.GOOGLE_CLIENT_ID,
    clientSecret: configuration.GOOGLE_CLIENT_SECRET,
    callbackURL: configuration.GOOGLE_CALLBACK_URL,
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Debug: Log the profile structure
      console.log("Passport signin profile:", JSON.stringify(profile, null, 2));
      
      // Use the OAuth service to handle user creation/authentication
      const result = await googleSignInService(profile);
      return done(null, result);
    } catch (err: any) {
      console.error("Passport signin error:", err.message);
      done(err, null);
    }
  }
));

// Configure Google OAuth Strategy for Sign-up
passport.use('google-signup', new GoogleStrategy(
  {
    clientID: configuration.GOOGLE_CLIENT_ID,
    clientSecret: configuration.GOOGLE_CLIENT_SECRET,
    callbackURL: configuration.GOOGLE_SIGNUP_CALLBACK_URL,
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Debug: Log the profile structure
      console.log("Passport signup profile:", JSON.stringify(profile, null, 2));
      
      // Use the OAuth service to handle user creation/authentication
      const result = await googleSignUpService(profile);
      return done(null, result);
    } catch (err: any) {
      console.error("Passport signup error:", err.message);
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done: any) => done(null, obj));

// Google OAuth initiation
const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    passport.authenticate("google-signin", { scope: ["profile", "email"] })(req, res, next);
  } catch (error) {
    next(error);
  }
};

// Google OAuth callback
const googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    passport.authenticate("google-signin", async (err: any, result: any) => {
      if (err) {
        const redirectUrl = getFrontendUrl('/user/oauth/callback', {
          success: 'false',
          error: err.message
        });
        return res.redirect(redirectUrl);
      }

      if (!result) {
        const redirectUrl = getFrontendUrl('/user/oauth/callback', {
          success: 'false',
          error: 'Authentication failed'
        });
        return res.redirect(redirectUrl);
      }

      // Redirect to frontend with token
      const redirectUrl = getFrontendUrl('/user/oauth/callback', {
        token: result.Token,
        success: 'true'
      });
      
      return res.redirect(redirectUrl);
    })(req, res, next);
  } catch (error: any) {
    next(error);
  }
};

// Google Sign Up initiation
const googleSignUp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    passport.authenticate("google-signup", { 
      scope: ["profile", "email"]
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

// Google Sign Up callback
const googleSignUpCallback = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    passport.authenticate("google-signup", async (err: any, profile: any) => {
      if (err) {
        const redirectUrl = getFrontendUrl('/user/oauth/callback', {
          success: 'false',
          error: err.message
        });
        return res.redirect(redirectUrl);
      }

      if (!profile) {
        const redirectUrl = getFrontendUrl('/user/oauth/callback', {
          success: 'false',
          error: 'Authentication failed'
        });
        return res.redirect(redirectUrl);
      }

      try {
        // The profile is already the result from the Passport strategy
        // No need to call googleSignUpService again
        const redirectUrl = getFrontendUrl('/user/oauth/callback', {
          token: profile.Token,
          success: 'true',
          action: 'signup'
        });
        
        return res.redirect(redirectUrl);
      } catch (signupError: any) {
        const redirectUrl = getFrontendUrl('/user/oauth/callback', {
          success: 'false',
          error: signupError.message
        });
        
        return res.redirect(redirectUrl);
      }
    })(req, res, next);
  } catch (error: any) {
    next(error);
  }
};

export { googleAuth, googleCallback, googleSignUp, googleSignUpCallback };