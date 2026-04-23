const contactEmailSender = require("../utils/contactEmailSender");

exports.contactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="cid:companyLogoCID" style="width:500px;" />

                </div>
                <h2 style="color: #333; margin-bottom: 20px;">New Contact Message</h2>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;"><strong>Name:</strong> ${name}</p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;"><strong>Email:</strong> ${email}</p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;"><strong>Message:</strong> ${message}</p>
            </div>
        `;

        await contactEmailSender(
            email,
            `New Contact Form: ${subject}`,
            htmlBody
        );

        res.status(200).json({
            success: true,
            message: "Message sent successfully!",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error sending message",
        });
    }
};
