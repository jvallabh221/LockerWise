const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, htmlBody) => {
    try {
        const host = process.env.MAIL_HOST || "smtp.gmail.com";
        const port = parseInt(process.env.MAIL_PORT || "587", 10);
        const fromEmail = process.env.FROM_EMAIL || process.env.MAIL_USER;

        let transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: fromEmail,
            to: email,
            subject: title,
            html: htmlBody,
            
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email: %s", error.message);
        throw new Error("Could not send email");
    }
};

module.exports = mailSender;
