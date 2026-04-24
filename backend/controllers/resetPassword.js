require('dotenv').config();

const mongoose = require('mongoose');
const mailSender = require("../utils/mailSender.js");
const OTP = require("../models/OTP.js");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const { withAtomic } = require("../utils/atomic");

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

exports.getOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }

        //Delete all OTPs for this email
        await OTP.deleteMany({ email });

        const otp = generateOTP();

        const newOTP = await OTP.create({ email, otp });

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.6;">
      
                <div style="text-align: center; margin-bottom: 20px;">
                    <img 
                    src="${process.env.IMG_LINK}" 
                    alt="Company Logo" 
                    style="width: 500px; height: auto;" 
                    />
                </div>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    We received a request to reset your password for the Locker Management System.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    Please use the One-Time Password (OTP) provided below to proceed with changing your password:
                </p>
                <p style="font-size: 16px; color: #333; font-weight: bold; margin: 0 0 10px 0;">
                    <strong>Your OTP:</strong> ${otp}
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    If you did not request this password reset, please ignore this email or contact our support team immediately.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0;">
                    Best regards,<br />
                    <strong>DraconX Pvt. Ltd</strong>,<br/>  
                    <strong>"From Vision to Validation, faster"</strong>
                </p>
            </div>
        `;

        await mailSender(email, "Your OTP for Password Reset", htmlBody);

        return res.status(201).json({
            message: "OTP sent successfully",
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message : `Error in sending OTP: ${err.message}`});
    }
};

exports.validateOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }

        const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(404).json({ message: "OTP not found. Please request a new OTP." });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
        }

        await OTP.deleteOne({ email });

        return res.status(200).json({
            message: "OTP successfully verified",
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message : `Error in validating OTP: ${err.message}`});
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email, and new password are required" });
        }

        await withAtomic(async (session) => {
            const user = await User.findOne({ email }).session(session);
            if (!user) {
                const e = new Error("User with this email does not exist");
                e.status = 404;
                throw e;
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save({ session });
            await OTP.deleteOne({ email }).session(session);
        });

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in resetting password: ${err.message}` });
    }
};
