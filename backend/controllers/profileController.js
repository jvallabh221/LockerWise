const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.updateProfile = async (req, res, next) => {
    try {
        const { userId, name, email, password, phone } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phoneNumber = phone;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const token = jwt.sign(
            {
                email: updatedUser.email,
                id: updatedUser._id,
                role: updatedUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        const userWithToken = { ...updatedUser.toObject(), token };

        const { password: pass, ...rest } = userWithToken;

        return res.status(200).json({
            message: "Profile updated successfully",
            data: rest,
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message : `Error in updating profile: ${err.message}`});
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email});

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashedPassword = user.password;

        const validPassword = await bcrypt.compare(oldPassword, hashedPassword);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = newHashedPassword;

        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in changing password: ${err.message}` });
    }
};