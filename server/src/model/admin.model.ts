import mongoose from "mongoose";
import IAdmin from "../interface/IAdmin";

const adminSchema = new mongoose.Schema<IAdmin>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
}, { timestamps: true });

const adminModel = mongoose.model("Admin", adminSchema);

export default adminModel;