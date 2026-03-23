import { Request, Response, NextFunction } from "express";
import configuration from "../config/configuration";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // First authenticate the user
    await authMiddleware(req, res, (err: any) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed",
        });
      }
    });

    // Then check if user has admin role
    const decode = req.user;
    
    if (!decode || decode.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Admin access required",
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during authorization",
    });
  }
};


export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const authHeader = req.headers["authorization"] || req.headers["Authorization"];
      const token = typeof authHeader === "string" ? authHeader.split(" ")[1] : undefined;
  
      if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
      }
  
      const decoded: any = jwt.verify(token, configuration.JWT_SECRET as string);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };