import { generateToken } from "../helper/jwt-handler";
import adminModel from "../model/admin.model";
import bcrypt from "bcrypt";
import { createAdminValidation } from "../validation/admin.validation";
import { IAdminServiceResponse } from "./interface/IAdmin";

const loginAdminService = async (email: string, password: string): Promise<IAdminServiceResponse> => {
    try {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return { success: false, message: "Admin not found", token: null };
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return { success: false, message: "Invalid password", token: null };
        }
        return { success: true, message: "Admin logged in successfully", token: generateToken({ id: admin._id, role: admin.role, email }, "7d") };
    } catch (error) {
        return { success: false, message: "Admin not found", error: error as Error, token: null };
    }
};

const registerAdminService = async (email: string, password: string): Promise<IAdminServiceResponse> => {
    try {
        const { error } = createAdminValidation.validate({ email, password });
        if (error) {
            return { success: false, message: error.message };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await adminModel.create({ email, password: hashedPassword || undefined });
        if (!admin) {
            return { success: false, message: "Admin not created" };
        }
        return { success: true, message: "Admin created successfully" };
    } catch (error) {
        console.log("erorr====", error);
        
        return { success: false, message: "Admin not created", error: error as Error };
    }
};

export { loginAdminService, registerAdminService };