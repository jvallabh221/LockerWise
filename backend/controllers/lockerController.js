require('dotenv').config();

const mongoose = require('mongoose');
const User = require("../models/userModel.js");
const Locker = require("../models/lockerModel.js");
const mailSender = require("../utils/mailSender.js");
const History = require("../models/History.js");
const Issue = require("../models/Issue.js");
const Price = require("../models/Prices.js");
const fs = require("fs");

exports.getAvailableLocker = async (req, res) => {
    try {
        const { lockerType, employeeGender } = req.body;

        if (!lockerType || !employeeGender) {
            return res.status(400).json({ message: "lockerType and employeeGender are required" });
        }

        const locker = await Locker.findOne({
            LockerStatus: "available",
            LockerType: lockerType,
            availableForGender: employeeGender,
        });

        if (!locker) {
            return res.status(400).json({ message: "No available locker found matching the criteria." });
        }

        return res.status(200).json({
            message: "Available locker found",
            data: locker,
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in fetching Available Lockers: ${err.message}` });
    }
};

function formatdate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
};

exports.allocateLocker = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { lockerNumber, lockerType, lockerCode, employeeName, employeeId, employeeEmail, employeePhone, employeeGender, costToEmployee, duration, startDate, endDate } = req.body;

        if (!lockerNumber) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "lockerNumber is required" });
        }

        const locker = await Locker.findOne({
            LockerNumber: lockerNumber,
            LockerStatus: "available",
        }).session(session);

        if (!locker) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Locker is not available or does not exist" });
        }

        let expiresOn;
        if (duration === "3") {
            // Set expiresOn to 3 months from the current date
            const threeMonthsFromNow = new Date();
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
            threeMonthsFromNow.setHours(23, 59, 59, 999); // Set time to 11:59 PM
            expiresOn = threeMonthsFromNow.toISOString();
        } else if (duration === "6") {
            // Set expiresOn to 6 months from the current date
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
            sixMonthsFromNow.setHours(23, 59, 59, 999); // Set time to 11:59 PM
            expiresOn = sixMonthsFromNow.toISOString();
        } else if (duration === "12") {
            // Set expiresOn to 12 months from the current date
            const twelveMonthsFromNow = new Date();
            twelveMonthsFromNow.setMonth(twelveMonthsFromNow.getMonth() + 12);
            twelveMonthsFromNow.setHours(23, 59, 59, 999); // Set time to 11:59 PM
            expiresOn = twelveMonthsFromNow.toISOString();
        } else if (endDate) {
            // Set expiresOn to provided endDate
            const expires = new Date(endDate);
            expires.setHours(23, 59, 59, 999); // Set time to 11:59 PM
            expiresOn = expires.toISOString();
        }

        locker.LockerCode = lockerCode;
        locker.LockerType = lockerType;
        locker.employeeName = employeeName;
        locker.employeeId = employeeId;
        locker.employeeEmail = employeeEmail;
        locker.employeePhone = employeePhone;
        locker.employeeGender = employeeGender;
        locker.CostToEmployee = costToEmployee;
        locker.Duration = duration;
        locker.StartDate = startDate;
        locker.EndDate = endDate;
        locker.LockerStatus = "occupied";

        locker.expiresOn = expiresOn;

        await locker.save({ session });

        const user = await User.findOne({ email: req.user.email }).session(session);

        await History.create([{ LockerNumber: lockerNumber, comment: "Allocated Successfully", LockerHolder: employeeName, InitiatedBy: user.name, Cost: costToEmployee, LockerStatus: "Occupied" }], { session });

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        // Send email after transaction commits
        const email = employeeEmail;
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
                    Dear ${employeeName},
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    We are pleased to inform you that a locker has been assigned to you as per your request. Please find the details below:
                </p>

                
                <p style="font-size: 16px; color: #333; font-weight: bold; margin: 0 0 10px 0;">
                    Locker Assignment Details:
                </p>
                <ul style="font-size: 16px; padding-left: 20px; margin: 0 0 15px 0; color: #333;">
                    <li><strong>Locker Number:</strong> ${lockerNumber}</li>
                    <li><strong>Locker Code:</strong> ${lockerCode}</li>
                    <li><strong>Duration:</strong> ${duration === "customize" ? `${formatdate(startDate)} to ${formatdate(endDate)}` : `${duration} Months`}</li>
                </ul>

                
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    Kindly ensure to use the locker responsibly and report any issues or concerns to the administration team.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    If you have any questions or require further assistance, please do not hesitate to contact us at <strong>[Support Email/Phone]</strong>.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0;">
                    Best regards,<br />
                    <strong>DraconX Pvt. Ltd</strong>,<br/>
                    <strong>"From Vision to Validation, faster"</strong>  
                </p>
            </div>
        `;

        await mailSender(email, "Your Locker Assignment Details ", htmlBody);

        return res.status(200).json({
            message: "Locker allocated successfully",
            data: locker,
        });
    } catch (err) {
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message: `Error in allocating Locker: ${err.message}` });
    } finally {
        session.endSession();
    }
};

exports.cancelLockerAllocation = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { lockerNumber, EmployeeEmail } = req.body;
        if (!lockerNumber || !EmployeeEmail) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "lockerNumber is required" });
        }

        // First check if this email has any locker (user registered with a locker)
        // Include both "occupied" (Cancel Locker) and "expired" (Reset from Update Locker)
        // Use case-insensitive email matching and ensure email is not empty
        const trimmedEmail = EmployeeEmail.trim();
        const lockerByEmail = await Locker.findOne({
            $and: [
                { employeeEmail: { $regex: new RegExp(`^${trimmedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
                { employeeEmail: { $ne: "" } },
                { employeeEmail: { $ne: null } },
                { LockerStatus: { $in: ["occupied", "expired"] } }
            ]
        }).session(session);

        if (!lockerByEmail) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "User not registered." });
        }

        // Email exists; check if the given locker number belongs to this user
        if (String(lockerByEmail.LockerNumber) !== String(lockerNumber)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Locker number is incorrect." });
        }

        const locker = lockerByEmail;
        const duration = locker.Duration
        const name = locker.employeeName

        const user = await User.findOne({ email: req.user.email }).session(session);

        await Issue.deleteMany({ LockerNumber: lockerNumber, email: EmployeeEmail }).session(session);

        await History.create([{ LockerNumber: lockerNumber, comment: "Allotment Cancelled", LockerHolder: name, InitiatedBy: user.name, Cost: locker.CostToEmployee, LockerStatus: "Available" }], { session });

        let oldCode = locker.LockerCode;
        let lockerCodeCombinations = locker.LockerCodeCombinations || [];
        let idx = lockerCodeCombinations.indexOf(oldCode) || 0;
        let newCode = lockerCodeCombinations[(idx + 1) % lockerCodeCombinations.length];

        locker.LockerStatus = "available";
        locker.LockerCode = newCode;

        locker.employeeName = "N/A";
        locker.employeeId = "";
        locker.employeeEmail = "";
        locker.employeePhone = "";
        locker.employeeGender = "None";
        locker.CostToEmployee = 0;
        locker.Duration = "";
        locker.StartDate = "";
        locker.EndDate = "";
        locker.LockerStatus = "available";
        locker.expiresOn = "";
        locker.emailSent = false;

        await locker.save({ session });

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        // Send email after transaction commits
        const email = EmployeeEmail;
        const currentDate = new Date();
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
                    Dear ${name},
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    We regret to inform you that your locker assignment has been cancelled. Below are the details of the cancelled locker:
                </p>
                
                <p style="font-size: 16px; color: #333; font-weight: bold; margin: 0 0 10px 0;">
                    Locker Details:
                </p>
                <ul style="font-size: 16px; padding-left: 20px; margin: 0 0 15px 0; color: #333;">
                    <li><strong>Locker Number:</strong> ${lockerNumber}</li>
                    <li><strong>Cancellation Date:</strong> ${formatdate(currentDate)}</li>
                    <li><strong>Original Validity Period:</strong> ${duration === "customize" ? `${formatdate(locker.StartDate)} to ${formatdate(locker.EndDate)}` : `${duration} Months`}</li>
                </ul>
                
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    If this cancellation was not requested by you or if you have any concerns, please contact us immediately at <strong>[Support Email/Phone]</strong>.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    We apologize for any inconvenience this may cause and are happy to assist with reassigning a locker if needed.
                </p>

                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    Thank you for your understanding.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0;">
                    Best regards,<br />
                    <strong>DraconX Pvt. Ltd</strong>,<br/>  
                    <strong>"From Vision to Validation, faster"</strong>
                </p>
            </div>
        `;
        await mailSender(email, "Notification of Locker Cancellation", htmlBody);

        return res.status(200).json({
            message: "Locker taken back successfully",
            data: locker,
        });
    } catch (err) {
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message: `Error in canceling locker: ${err.message}` });
    } finally {
        session.endSession();
    }
};

exports.renewLocker = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { lockerNumber, costToEmployee, duration, startDate, endDate, EmployeeEmail } = req.body;

        if (!lockerNumber || !EmployeeEmail) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "lockerNumber is required" });
        }

        // First check if this email has any locker (user registered with a locker)
        // Include both "occupied" (Renew active locker) and "expired" (Renew from Update Locker)
        // Use case-insensitive email matching and ensure email is not empty
        const trimmedEmail = EmployeeEmail.trim();
        const lockerByEmail = await Locker.findOne({
            $and: [
                { employeeEmail: { $regex: new RegExp(`^${trimmedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
                { employeeEmail: { $ne: "" } },
                { employeeEmail: { $ne: null } },
                { LockerStatus: { $in: ["occupied", "expired"] } }
            ]
        }).session(session);

        if (!lockerByEmail) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "User not registered." });
        }

        // Email exists; check if the given locker number belongs to this user
        if (String(lockerByEmail.LockerNumber) !== String(lockerNumber)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Locker number is incorrect." });
        }

        const locker = lockerByEmail;
        const employeeName = locker.employeeName

        let expiresOn;
        if (duration === "3") {
            // Set expiresOn to 3 months from the current date
            const threeMonthsFromNow = new Date();
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
            threeMonthsFromNow.setHours(23, 59, 59, 999);
            expiresOn = threeMonthsFromNow.toISOString();
        } else if (duration === "6") {
            // Set expiresOn to 6 months from the current date
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
            sixMonthsFromNow.setHours(23, 59, 59, 999);
            expiresOn = sixMonthsFromNow.toISOString();
        } else if (duration === "12") {
            // Set expiresOn to 12 months from the current date
            const twelveMonthsFromNow = new Date();
            twelveMonthsFromNow.setMonth(twelveMonthsFromNow.getMonth() + 12);
            twelveMonthsFromNow.setHours(23, 59, 59, 999);
            expiresOn = twelveMonthsFromNow.toISOString();
        } else if (endDate) {
            // Set expiresOn to provided endDate
            const expires = new Date(endDate);
            expires.setHours(23, 59, 59, 999);
            expiresOn = expires.toISOString();
        }

        locker.CostToEmployee = costToEmployee;
        locker.Duration = duration;
        locker.StartDate = startDate;
        locker.EndDate = endDate;
        locker.LockerStatus = "occupied";
        locker.emailSent = "false";
        locker.expiresOn = expiresOn;

        await locker.save({ session });

        const user = await User.findOne({ email: req.user.email }).session(session);

        await History.create([{ LockerNumber: lockerNumber, comment: "Locker Renewed", LockerHolder: employeeName, InitiatedBy: user.name, Cost: costToEmployee, LockerStatus: "Occupied" }], { session });

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        // Send email after transaction commits
        const email = EmployeeEmail;
        const currentDate = new Date();
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
                    Dear ${employeeName},
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                   We are pleased to inform you that your locker renewal has been successfully processed. Below are the updated details of your locker:
                </p>

                
                <p style="font-size: 16px; color: #333; font-weight: bold; margin: 0 0 10px 0;">
                    Locker Details:
                </p>
                <ul style="font-size: 16px; padding-left: 20px; margin: 0 0 15px 0; color: #333;">
                    <li><strong>Locker Number:</strong> ${lockerNumber}</li>
                    <li><strong>Renewal Date:</strong> ${formatdate(currentDate)}</li>
                    <li><strong>New Validity Period:</strong> ${duration === "customize" ? `${formatdate(startDate)} to ${formatdate(endDate)}` : `${duration} Months`}</li>
                </ul>

                
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    Thank you for renewing your locker. We are committed to providing a seamless and secure locker management experience
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    If you have any questions or need further assistance, please feel free to contact us at <strong>[Support Email/Phone]</strong>.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0;">
                    Best regards,<br />
                    <strong>DraconX Pvt. Ltd</strong>,<br/>
                    <strong>"From Vision to Validation, faster"</strong>  
                </p>
            </div>
        `;

        await mailSender(email, "Your Locker Renewal Has Been Successfully Processsed", htmlBody);

        return res.status(200).json({
            message: "Locker Renewed successfully",
            data: locker,
        });
    } catch (err) {
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message: `Error in Renewing Locker: ${err.message}` });
    } finally {
        session.endSession();
    }
};

exports.getAllLockers = async (req, res) => {
    try {
        const lockers = await Locker.find();

        // Enhance expired lockers with next combination
        const data = lockers.map((locker) => {
            if (locker.LockerStatus === "expired") {
                const combinations = locker.LockerCodeCombinations || [];
                const currentCode = locker.LockerCode;
                let nextCombination = null;

                if (combinations.length > 0) {
                    const currentIndex = combinations.indexOf(currentCode);
                    if (currentIndex !== -1 && currentIndex + 1 < combinations.length) {
                        nextCombination = combinations[currentIndex + 1];
                    } else {
                        nextCombination = combinations[0]; // Wrap around
                    }
                }

                return {
                    ...locker.toObject(),
                    nextLockerCombination: nextCombination,
                };
            }

            return locker.toObject(); // Return normal locker object if not expired
        });

        return res.status(200).json({
            message: "All Lockers",
            data,
        });
    } catch (err) {
        console.error("Error fetching lockers:", err);
        return res.status(500).json({ message: `Error in fetching Lockers: ${err.message}` });
    }
};

exports.getExpiringIn7daysLockers = async (req, res) => {
    try {
        const todayUTC = new Date();
        todayUTC.setHours(0, 0, 0, 0); // Start of IST day

        const sevenDaysFromNowUTC = new Date(todayUTC);
        sevenDaysFromNowUTC.setDate(todayUTC.getUTCDate() + 7); // 7 days from now
        sevenDaysFromNowUTC.setHours(23, 59, 59, 999); // End of IST day

        const data = await Locker.find({
            expiresOn: { $gte: todayUTC, $lte: sevenDaysFromNowUTC },
        });

        return res.status(200).json({
            message: "Lockers expiring within the next 7 days",
            data,
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in fetching expiring Lockers: ${err.message}` });
    }
};

exports.getExpiringToday = async (req, res) => {
    try {
        const todayUTC = new Date();
        todayUTC.setHours(0, 0, 0, 0); // Start of UTC day

        const endOfTodayUTC = new Date(todayUTC);
        endOfTodayUTC.setHours(23, 59, 59, 999); // End of UTC day

        const data = await Locker.find({
            expiresOn: { $gte: todayUTC, $lte: endOfTodayUTC },
        });

        return res.status(200).json({
            message: "Lockers expiring today",
            data,
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in fetching expiring lockers: ${err.message}` });
    }
};

exports.deleteLocker = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { lockerNumber } = req.body;

        if (!lockerNumber) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Locker number is required" });
        }

        // Find and delete by lockerNumber instead of _id
        const deletedLocker = await Locker.findOneAndDelete({ LockerNumber: lockerNumber }).session(session);

        if (!deletedLocker) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Locker not found" });
        }

        await Issue.deleteMany({ LockerNumber: lockerNumber }).session(session);

        await History.create([{ LockerNumber: lockerNumber, comment: "Locker Deleted", LockerHolder: "N/A", InitiatedBy: "Admin", Cost: 0, LockerStatus: "Deleted" }], { session });

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        return res.status(200).json({
            message: "Locker deleted successfully",
            data: deletedLocker,
        });
    } catch (err) {
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message: `Error in deleting Locker: ${err.message}` });
    } finally {
        session.endSession();
    }
};

exports.getLockerPrices = async (req, res) => {
    try {
        const prices = await Price.find();

        return res.status(200).json({
            message: "All Locker Prices",
            data: prices,
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in fetching Locker Prices: ${err.message}` });
    }
};

exports.editLockerDetails = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { LockerDetails } = req.body;

        if (!LockerDetails || !LockerDetails.LockerNumber) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "LockerNumber is required" });
        }
        const locker = await Locker.findOne({ LockerNumber: LockerDetails.LockerNumber }).session(session);
        if (!locker) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Locker not found" });
        }

        // Update locker details
        await Locker.updateOne(
            { LockerNumber: LockerDetails.LockerNumber },
            { $set: LockerDetails },
            { session }
        );

        let userName = "Admin";
        if (req.user.role !== "Admin") {
            const user = await User.findOne({ email: req.user.email }).session(session);
            userName = user.name;
        }
        const stat = (locker.LockerStatus).charAt(0).toUpperCase() + (locker.LockerStatus).slice(1);
        await History.create([{ LockerNumber: LockerDetails.LockerNumber, comment: "Locker Details Updated", LockerHolder: LockerDetails.employeeName, InitiatedBy: userName, Cost: locker.CostToEmployee, LockerStatus: stat }], { session });

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        // Send email after transaction commits
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
                    Dear ${LockerDetails.employeeName},
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    This is to inform you that your locker has been updated. Below are the details of the updated locker:
                </p>

                
                <p style="font-size: 16px; color: #333; font-weight: bold; margin: 0 0 10px 0;">
                    Locker Details:
                </p>
                <ul style="font-size: 16px; padding-left: 20px; margin: 0 0 15px 0; color: #333;">
                    <li><strong>Locker Number:</strong> ${LockerDetails.LockerNumber}</li>
                    <li><strong>Name:</strong> ${LockerDetails.employeeName}</li>
                    <li><strong>Phone Number:</strong> ${LockerDetails.employeePhone}</li>
                    <li><strong>Id:</strong> ${LockerDetails.employeeId}</li>
                    <li><strong>Locker Code:</strong> ${LockerDetails.LockerCode}</li>
                </ul>

                
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    If this update was not requested by you or if you have any concerns, please contact us immediately at <strong>[Support Email/Phone]</strong>.
                </p>

                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    Thank you for using lockerwise.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0;">
                    Best regards,<br />
                    <strong>DraconX Pvt. Ltd</strong>,<br/>  
                    <strong>"From Vision to Validation, faster"</strong>
                </p>
            </div>
        `;
        await mailSender(locker.employeeEmail, "Notification of Locker Update", htmlBody);

        return res.status(200).json({ message: "Locker updated successfully" });
    } catch (err) {
        await session.abortTransaction();
        console.error("Error:", err);
        return res.status(err.status || 500).json({ message: `Error in editing Locker: ${err.message}` });
    } finally {
        session.endSession();
    }

};

exports.changeLockerStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { LockerNumber, LockerStatus } = req.body;

        if (!LockerNumber) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "LockerNumber is required" });
        }

        const locker = await Locker.findOne({ LockerNumber: LockerNumber }).session(session);

        if (!locker) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Locker not found" });
        }

        // Update locker details
        await Locker.updateOne(
            { LockerNumber: LockerNumber },
            { $set: { LockerStatus } },
            { session }
        );

        let userName = "Admin";
        if (req.user.role !== "Admin") {
            const user = await User.findOne({ email: req.user.email }).session(session);
            userName = user.name;
        }
        const stat = (LockerStatus).charAt(0).toUpperCase() + (LockerStatus).slice(1);
        await History.create([{ LockerNumber: LockerNumber, comment: "Locker Status Changed", LockerHolder: locker.employeeName, InitiatedBy: userName, Cost: locker.CostToEmployee, LockerStatus: stat }], { session });

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        return res.status(200).json({ message: "Locker updated successfully" });
    } catch (err) {
        await session.abortTransaction();
        console.error("Error:", err);
        return res.status(err.status || 500).json({ message: `Error in editing Locker: ${err.message}` });
    } finally {
        session.endSession();
    }
};

exports.updateMultipleLockerPrices = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { LockerPrice3Month,
            LockerPrice6Month,
            LockerPrice12Month,
            availableForGender,
            LockerType } = req.body;

        if (!availableForGender || !['male', 'female'].includes(availableForGender.toLowerCase())) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: 'Invalid gender. Must be "male" or "female".' });
        }

        const updateData = {};
        if (LockerPrice3Month) updateData['LockerPrice3Month'] = LockerPrice3Month;
        if (LockerPrice6Month) updateData['LockerPrice6Month'] = LockerPrice6Month;
        if (LockerPrice12Month) updateData['LockerPrice12Month'] = LockerPrice12Month;

        if (Object.keys(updateData).length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: 'At least one price must be provided (3, 6, or 12 months).' });
        }

        const result = await Locker.updateMany(
            { availableForGender: availableForGender, LockerType: LockerType },
            { $set: updateData },
            { session }
        );

        await Price.updateOne(
            { availableForGender: availableForGender, LockerType: LockerType },
            { $set: updateData },
            { upsert: true, session }
        );

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        res.status(200).json({
            message: 'Locker prices updated successfully.',
            updatedCount: result.nModified
        })
    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating locker prices:', error);
        res.status(error.status || 500).json({ error: 'Internal server error' });
    } finally {
        session.endSession();
    }
};
