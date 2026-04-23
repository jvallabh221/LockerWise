const nodemailer = require("nodemailer");
require("dotenv").config();

const contactEmailSender = async (email, title, htmlBody) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: email,
            to: process.env.FROM_EMAIL,
            subject: title,
            html: htmlBody,
            attachments: [
                {
                    filename: "companyLogo.png",
                    path: __dirname + "/../controllers/companyLogo.png",
                    cid: "companyLogoCID" // same as html
                }
            ]
        
        });

        return info;
    } catch (error) {
        console.error("Mail error:", error.message);
        throw new Error("Could not send email");
    }
};

module.exports = contactEmailSender;
