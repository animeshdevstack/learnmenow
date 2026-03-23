/** @format */

import nodemailer, { Transporter } from "nodemailer";
import configuration from "../../config/configuration";

export const sendForgetPasswordEmail = async (name: string, to: string, resetLink: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configuration.ADMIN_GMAIL_ACCOUNT,
        pass: configuration.ADMIN_GMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: `"CompetitiveExamPrep" <${configuration.ADMIN_GMAIL_ACCOUNT}>`,
      to,
      subject: "Password Reset Request - Competitive Exam Preparation",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f9fafb; padding: 36px;">
          <div style="max-width: 530px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 22px rgba(51,71,120,0.12);">
            <div style="background: linear-gradient(94deg, #4568dc 0%, #b06ab3 100%); padding: 22px; color: #fff; text-align: center; border-top-left-radius:16px; border-top-right-radius:16px;">
              <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" alt="Reset Password" width="50" height="50" style="margin-bottom: 13px;"/>
              <h1 style="margin: 0; font-size: 2rem; font-weight:600; letter-spacing: 0.5px;">Competitive Exam Prep</h1>
            </div>
            <div style="padding: 34px 32px 26px;">
              <h2 style="color: #4568dc; margin: 0 0 14px; font-size: 1.34rem; font-weight: 700;">Reset Your Password</h2>
              <p style="font-size: 16px; color:#183266; margin-bottom: 24px;">
                Hi <span style="font-weight:600;">${name}</span>,
                <br/><br/>
                We received a request to reset your password for your CompetitiveExamPrep account. 
                Click the button below to choose a new password.
              </p>
              <div style="text-align: center; margin: 38px 0;">
                <a href="${resetLink}" target="_blank"
                  style="display:inline-block; background: linear-gradient(94deg, #4568dc 0%, #b06ab3 100%); color: #fff; padding: 13px 38px; text-decoration: none; border-radius: 7px;
                    font-weight: 700; font-size: 1.08rem; box-shadow: 0 2px 9px rgba(69,104,220,0.14); letter-spacing: 0.5px;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
                <b>The password reset link will expire in 10 minutes.</b> If you did not request a password reset, no further action is required and you may safely ignore this email.
              </p>
              <p style="font-size: 13px; color: #b0b9d1; margin-top: 30px;font-style:italic;">
                Need more help? Contact support at <a href="mailto:${configuration.ADMIN_GMAIL_ACCOUNT}" style="color: #4568dc; text-decoration: underline;">${configuration.ADMIN_GMAIL_ACCOUNT}</a>.<br />
                Stay secure,<br />The Competitive Exam Prep Team.
              </p>
            </div>
            <div style="background: #f1effb; padding: 15px 12px; text-align: center; font-size: 12px; color: #596080; border-bottom-left-radius:16px; border-bottom-right-radius:16px;">
              &copy; ${new Date().getFullYear()} Competitive Exam Prep. All rights reserved.
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(error.message || "Internal server error while sending the reset password email");
  }
};

