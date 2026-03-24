"use strict";
/** @format */
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
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const configuration_1 = __importDefault(require("../../config/configuration"));
const sendVerificationEmail = (name, to, verificationLink) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: configuration_1.default.ADMIN_GMAIL_ACCOUNT,
                pass: configuration_1.default.ADMIN_GMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: `"CompetitiveExamPrep" <${configuration_1.default.ADMIN_GMAIL_ACCOUNT}>`,
            to,
            subject: "Verify Your Email - Competitive Exam Preparation",
            html: `
        <div style="font-family: 'Roboto', Arial, sans-serif; background: #f8fafc; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 6px 20px rgba(20,60,120,0.10); overflow: hidden;">
            <div style="background: linear-gradient(90deg, #2541b2 0%, #6a82fb 100%); padding: 24px; color: #fff; text-align: center;">
              <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Flearnmenow%2F&psig=AOvVaw0ntn1FzPTohicd7hytkTty&ust=1760686323554000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKDP3OiZqJADFQAAAAAdAAAAABAE" alt="exam logo" width="52" style="vertical-align: middle; margin-bottom: 8px;" />
              <h1 style="margin: 0; font-size: 2.1rem; letter-spacing: 1px;">Competitive Exam Prep</h1>
              <p style="margin: 10px 0 0; font-size: 1rem;">Your Gateway to Exam Success</p>
            </div>
            <div style="padding: 34px 30px 24px 30px;">
              <h2 style="color: #2541b2; margin-bottom: 14px;">Welcome, ${name}!</h2>
              <p style="font-size: 16px; margin-bottom: 24px;">
                Thank you for joining Learn Me Now Exam Prep! Please confirm your email address to get started with live tracking, analysis and personalized preparation.
              </p>
              <div style="text-align: center; margin: 34px 0;">
                <a href="${verificationLink}" target="_blank" style="background: linear-gradient(90deg, #2541b2 0%, #6a82fb 100%); color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 1.05rem; box-shadow: 0 2px 9px rgba(40,80,160,0.11);">
                  Verify My Email
                </a>
              </div>
              <p style="font-size: 14px; color: #4b5563;">This link remains valid for the next 10 minutes. If you did not create an account, please ignore this email.</p>
              <p style="font-size: 14px; color: #94a3b8; margin-top: 32px;">Happy Learning,<br/>Learn Me Now Team</p>
            </div>
            <div style="background: #e3e9fc; padding: 18px 15px; text-align: center; font-size: 12px; color: #556085;">
              © ${new Date().getFullYear()} Competitive Exam Prep. All rights reserved.
            </div>
          </div>
        </div>
      `,
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=user-signup-email.js.map