import jwt, { SignOptions } from "jsonwebtoken";
import configuration from "../config/configuration";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
    user?: any; 
}


export const generateToken = (
  payload: string | object ,
  expiresIn: any
): string => {
  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, configuration.JWT_SECRET as string, options);
};



export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, configuration.JWT_SECRET as string);
    } catch (error) {
        return error as Error;
    }
};



