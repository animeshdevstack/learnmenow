import { NextFunction, Request, Response } from "express";
import { loginAdminService, registerAdminService } from "../service/admin-auth.service";

const loginAdmin = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    try {
        const { email, password } = req.body;
        const { success, message, token } = await loginAdminService (email, password);
        return res.status(success ? 200 : 401).json({ message, token, success, status: success ? 200 : 401 });
    } catch (error) {
        next(error);
    }
};

const registerAdmin = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    try {
        const { email, password } = req.body;
        const { success, message } = await registerAdminService (email, password);
        return res.status(success ? 201 : 400).json({ message, success, status: success ? 201 : 400 });
    } catch (error) {
        next(error);
    }
        
};

export { loginAdmin, registerAdmin };