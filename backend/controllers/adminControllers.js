require('dotenv').config();

const mongoose = require('mongoose');
const Locker = require('../models/lockerModel.js')
const User = require('../models/userModel.js')
const History = require('../models/History.js')
const bcrypt = require('bcrypt');
const mailSender = require('../utils/mailSender')

exports.addStaff = async (req, res) => {
    try {
        const { name, role, email, password, phoneNumber, gender } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, role, email, phoneNumber, password: hashedPassword, gender });

        const { password: pass, ...rest } = user;

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.6;">
      
                <div style="text-align: center; margin-bottom: 20px;">
                    <img 
                    src="${process.env.IMG_LINK}" 
                    alt="Company Logo" 
                    style="width: err.status || 500px; height: auto;" 
                    />
                </div>

                
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    Dear ${name},
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    We are excited to inform you that you have been successfully added to our Lockerwise. This system allows you to manage your locker assignments efficiently and securely. 
                </p>

                
                <p style="font-size: 16px; color: #333; font-weight: bold; margin: 0 0 10px 0;">
                    Here are your account details:
                </p>
                <ul style="font-size: 16px; padding-left: 20px; margin: 0 0 15px 0; color: #333;">
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Temporary Password:</strong> ${password}</li>
                    <li><strong>Portal Link:</strong><a href="${process.env.APP_URL}/login" target="_blank" rel="noopener noreferrer">${process.env.APP_URL}/login</a></li>
                </ul>

                
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    Please log in using the above credentials and change your password upon first login to ensure account security. 
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    If you have any questions or need assistance accessing your account, please don’t hesitate to contact us at <strong>[Support Email/Phone]<strong/>. 
                </p>

                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    We’re thrilled to have you onboard! 
                </p>
                <p style="font-size: 16px; color: #333; margin: 0;">
                    Best regards,<br />
                    <strong>DraconX Pvt. Ltd</strong>,<br/>  
                    <strong>"From Vision to Validation, faster"</strong>
                </p>
            </div>
        `;

        await mailSender(
            email,
            "Welcome! You've Been Added to the Lockerwise",
            htmlBody
        );

        return res.status(201).json({ message: 'Staff Added Sucessfully...' });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in adding staff: ${err.message}` });
    }
};

exports.editStaff = async (req, res) => {
    try {
        const { id } = req.body;

        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, role, email, password, phoneNumber, gender } = req.body;

        if (name && name.length !== 0) user.name = name;
        if (role && role.length !== 0) user.role = role;
        if (email && email.length !== 0) user.email = email;
        if (phoneNumber && phoneNumber.length !== 0) user.phoneNumber = phoneNumber;
        if (gender && gender.length !== 0) user.gender = gender;

        if (password && password.length !== 0) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        return res.status(200).json({ message: 'User updated successfully', });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in editing staff: ${err.message}` });
    }
};

exports.viewStaffDetails = async (req, res) => {
    try {
        const { id } = req.body;

        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...rest } = user._doc;
        return res.status(200).json({
            message: 'User Details fetched successfully',
            user: rest
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in fetching staff: ${err.message}` });
    }
};

exports.viewAllStaff = async (req, res) => {
    try {
        let users = await User.find({ role: "Staff" });

        return res.status(200).json({
            message: 'Users  fetched successfully',
            users: users.length ? users : []
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in fetching all staff: ${err.message}` });
    }
};

exports.removeStaff = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Staff ID is required" });
        }

        const deletedStaff = await User.findByIdAndDelete(id);

        if (!deletedStaff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        return res.status(200).json({ message: "Staff member removed successfully" });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in removing staff: ${err.message}` });
    }
};

exports.addLocker = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { LockerType, LockerNumber, LockerCodeCombinations, LockerPrice3Month, LockerPrice6Month, LockerPrice12Month, availableForGender, LockerSerialNumber } = req.body;
        const [locker] = await Locker.create([{ LockerType, LockerNumber, LockerCodeCombinations, LockerPrice3Month, LockerPrice6Month, LockerPrice12Month, availableForGender, LockerSerialNumber }], { session });

        locker.LockerCode = LockerCodeCombinations[0];
        await locker.save({ session });

        await History.create([{ LockerNumber: LockerNumber, comment: "Locker Added", LockerHolder: "N/A", InitiatedBy: "Admin", Cost: 0, LockerStatus: "Available" }], { session });

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        return res.status(201).json({
            message: "Locker Created Successfully",
            data: locker
        });
    } catch (err) {
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message: `Error in adding locker: ${err.message}` });
    } finally {
        session.endSession();
    }
}

exports.addMultipleLocker = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const lockersData = req.body;

        if (!Array.isArray(lockersData)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "Invalid input: Expected an array of locker objects"
            });
        }

        const updatedLockersData = lockersData.map((lockerData) => {
            if (lockerData.LockerCodeCombinations && lockerData.LockerCodeCombinations.length > 0) {
                lockerData.LockerCode = lockerData.LockerCodeCombinations[0];
            }
            return lockerData;
        });

        const newLockers = await Locker.insertMany(updatedLockersData, { session });

        // Create history records for all lockers
        const historyRecords = newLockers.map(locker => ({
            LockerNumber: locker.LockerNumber,
            comment: "Locker Added",
            LockerHolder: "N/A",
            InitiatedBy: "Admin",
            Cost: 0,
            LockerStatus: "Available"
        }));

        await History.insertMany(historyRecords, { session });

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        return res.status(201).json({
            message: "Lockers Created Successfully",
            data: newLockers
        });
    } catch (err) {
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message: `Error in creating lockers: ${err.message}` });
    } finally {
        session.endSession();
    }
};

exports.viewFullHistory = async (req, res) => {
    try {
        const history = await History.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "History fetched successfully",
            history: history.length ? history : [],
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in fetching history: ${err.message}` });
    }
};

exports.clearHistory = async (req, res) => {
    const stDate = req.body.clearStartDate;
    const enDate = req.body.clearEndDate;
    // console.log(stDate, enDate);
    try {
        await History.deleteMany({ createdAt: { $gte: stDate, $lte: enDate } });

        return res.status(200).json({ message: "History cleared successfully" });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in clearing history: ${err.message}` });
    }
}
