require('dotenv').config();

const mongoose = require('mongoose');
const User = require("../models/userModel.js");
const Locker = require("../models/lockerModel.js");
const Assignment = require("../models/assignmentModel.js");
const mailSender = require("../utils/mailSender.js");
const History = require("../models/History.js");
const Issue = require("../models/Issue.js");
const Price = require("../models/Prices.js");
const fs = require("fs");
const { withAtomic } = require("../utils/atomic");
const {
    flattenLocker,
    flattenLockers,
    mergeAssignmentIntoLocker,
    ASSIGNMENT_FIELD_SET,
} = require("../utils/flattenLockerResponse.js");

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
            data: await flattenLocker(locker),
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
    try {
        const { lockerNumber, lockerType, lockerCode, employeeName, employeeId, employeeEmail, employeePhone, employeeGender, costToEmployee, duration, startDate, endDate } = req.body;

        if (!lockerNumber) {
            return res.status(400).json({ message: "lockerNumber is required" });
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

        const locker = await withAtomic(async (session) => {
            const l = await Locker.findOne({
                LockerNumber: lockerNumber,
                LockerStatus: "available",
            }).session(session);
            if (!l) {
                const e = new Error("Locker is not available or does not exist");
                e.status = 400;
                throw e;
            }
            // Locker-config fields stay on Locker. The 11 assignment fields
            // (employeeName/Email/Id/Phone/Gender, CostToEmployee, Duration,
            // StartDate, EndDate, expiresOn, emailSent) now live on the new
            // Assignment doc created below.
            l.LockerCode = lockerCode;
            l.LockerType = lockerType;
            l.LockerStatus = "occupied";
            await l.save({ session });

            await Assignment.create(
                [{
                    lockerId: l._id,
                    employeeName,
                    employeeId,
                    employeeEmail,
                    employeePhone,
                    employeeGender,
                    CostToEmployee: costToEmployee,
                    Duration: duration,
                    StartDate: startDate,
                    EndDate: endDate,
                    expiresOn,
                    emailSent: false,
                    status: 'active',
                }],
                { session }
            );

            const user = await User.findOne({ email: req.user.email }).session(session);
            await History.create(
                [{ LockerNumber: lockerNumber, comment: "Allocated Successfully", LockerHolder: employeeName, InitiatedBy: user?.name || "System", Cost: costToEmployee, LockerStatus: "Occupied" }],
                { session }
            );
            return l;
        });

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
            data: await flattenLocker(locker),
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in allocating Locker: ${err.message}` });
    }
};

exports.cancelLockerAllocation = async (req, res) => {
    try {
        const { lockerNumber, EmployeeEmail } = req.body;
        if (!lockerNumber || !EmployeeEmail) {
            return res.status(400).json({ message: "lockerNumber is required" });
        }

        const trimmedEmail = EmployeeEmail.trim();

        const { locker, name, duration, originalStartDate, originalEndDate } = await withAtomic(async (session) => {
            // Active Assignment is the source of truth; Locker's old fields
            // are stale copy during the A2.0 → A2.0.1 window.
            const activeAsgn = await Assignment.findOne({
                employeeEmail: { $regex: new RegExp(`^${trimmedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                status: 'active',
                deletedAt: null,
            }).session(session);

            if (!activeAsgn) {
                const e = new Error("User not registered.");
                e.status = 400;
                throw e;
            }

            const lockerByEmail = await Locker.findOne({
                _id: activeAsgn.lockerId,
                LockerStatus: { $in: ["occupied", "expired"] },
            }).session(session);

            if (!lockerByEmail) {
                const e = new Error("User not registered.");
                e.status = 400;
                throw e;
            }

            if (String(lockerByEmail.LockerNumber) !== String(lockerNumber)) {
                const e = new Error("Locker number is incorrect.");
                e.status = 400;
                throw e;
            }

            const l = lockerByEmail;
            // Capture pre-cancellation values from the Assignment for History
            // + the cancellation email's "Original Validity Period" line.
            const capturedName = activeAsgn.employeeName;
            const capturedCost = activeAsgn.CostToEmployee;
            const capturedDuration = activeAsgn.Duration;
            const capturedStartDate = activeAsgn.StartDate;
            const capturedEndDate = activeAsgn.EndDate;

            const user = await User.findOne({ email: req.user.email }).session(session);

            await Issue.deleteMany({ LockerNumber: lockerNumber, email: EmployeeEmail }).session(session);

            await History.create(
                [{ LockerNumber: lockerNumber, comment: "Allotment Cancelled", LockerHolder: capturedName, InitiatedBy: user?.name || "System", Cost: capturedCost, LockerStatus: "Available" }],
                { session }
            );

            // End the Assignment (status='ended', reason='cancelled', endedAt=now).
            activeAsgn.status = 'ended';
            activeAsgn.endedReason = 'cancelled';
            activeAsgn.endedAt = new Date();
            await activeAsgn.save({ session });

            // Rotate LockerCode to the next combination (preserves pre-A2.0.1
            // behavior). Config-only update on Locker.
            const oldCode = l.LockerCode;
            const lockerCodeCombinations = l.LockerCodeCombinations || [];
            const idx = lockerCodeCombinations.indexOf(oldCode) || 0;
            const newCode = lockerCodeCombinations.length
                ? lockerCodeCombinations[(idx + 1) % lockerCodeCombinations.length]
                : oldCode;

            l.LockerCode = newCode;
            l.LockerStatus = "available";
            await l.save({ session });

            return {
                locker: l,
                name: capturedName,
                duration: capturedDuration,
                originalStartDate: capturedStartDate,
                originalEndDate: capturedEndDate,
            };
        });

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
                    <li><strong>Original Validity Period:</strong> ${duration === "customize" ? `${formatdate(originalStartDate)} to ${formatdate(originalEndDate)}` : `${duration} Months`}</li>
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
            data: await flattenLocker(locker),
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in canceling locker: ${err.message}` });
    }
};

exports.renewLocker = async (req, res) => {
    try {
        const { lockerNumber, costToEmployee, duration, startDate, endDate, EmployeeEmail } = req.body;

        if (!lockerNumber || !EmployeeEmail) {
            return res.status(400).json({ message: "lockerNumber is required" });
        }

        const trimmedEmail = EmployeeEmail.trim();

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

        const { locker, employeeName } = await withAtomic(async (session) => {
            // Email lookup now hits Assignment (the source of truth post-A2.0).
            const activeAsgn = await Assignment.findOne({
                employeeEmail: { $regex: new RegExp(`^${trimmedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                status: 'active',
                deletedAt: null,
            }).session(session);

            if (!activeAsgn) {
                const e = new Error("User not registered.");
                e.status = 400;
                throw e;
            }

            const lockerByEmail = await Locker.findOne({
                _id: activeAsgn.lockerId,
                LockerStatus: { $in: ["occupied", "expired"] },
            }).session(session);

            if (!lockerByEmail) {
                const e = new Error("User not registered.");
                e.status = 400;
                throw e;
            }

            if (String(lockerByEmail.LockerNumber) !== String(lockerNumber)) {
                const e = new Error("Locker number is incorrect.");
                e.status = 400;
                throw e;
            }

            const name = activeAsgn.employeeName;

            // Renew updates the Assignment, not Locker's (removed-in-commit-10) fields.
            activeAsgn.CostToEmployee = costToEmployee;
            activeAsgn.Duration = duration;
            activeAsgn.StartDate = startDate;
            activeAsgn.EndDate = endDate;
            activeAsgn.emailSent = false;
            activeAsgn.expiresOn = expiresOn;
            await activeAsgn.save({ session });

            // Locker status bumps back to occupied if it had expired.
            lockerByEmail.LockerStatus = "occupied";
            await lockerByEmail.save({ session });

            const user = await User.findOne({ email: req.user.email }).session(session);

            await History.create(
                [{ LockerNumber: lockerNumber, comment: "Locker Renewed", LockerHolder: name, InitiatedBy: user?.name || "System", Cost: costToEmployee, LockerStatus: "Occupied" }],
                { session }
            );

            return { locker: lockerByEmail, employeeName: name };
        });

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
            data: await flattenLocker(locker),
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in Renewing Locker: ${err.message}` });
    }
};

exports.getAllLockers = async (req, res) => {
    try {
        const lockers = await Locker.find();
        const flattened = await flattenLockers(lockers);

        // Preserve the pre-A2.0.1 expired-locker enhancement (adds
        // nextLockerCombination to the response for expired entries).
        const data = flattened.map((locker) => {
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
                    ...locker,
                    nextLockerCombination: nextCombination,
                };
            }

            return locker;
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
        sevenDaysFromNowUTC.setDate(todayUTC.getUTCDate() + 7);
        sevenDaysFromNowUTC.setHours(23, 59, 59, 999);

        // expiresOn now lives on Assignment (post-A2.0). Query there, then
        // resolve the Lockers + flatten for the response.
        const asgns = await Assignment.find({
            expiresOn: { $gte: todayUTC, $lte: sevenDaysFromNowUTC },
            status: 'active',
            deletedAt: null,
        });
        const lockerIds = asgns.map((a) => a.lockerId);
        const lockers = await Locker.find({ _id: { $in: lockerIds } });
        const data = await flattenLockers(lockers);

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
        todayUTC.setHours(0, 0, 0, 0);

        const endOfTodayUTC = new Date(todayUTC);
        endOfTodayUTC.setHours(23, 59, 59, 999);

        const asgns = await Assignment.find({
            expiresOn: { $gte: todayUTC, $lte: endOfTodayUTC },
            status: 'active',
            deletedAt: null,
        });
        const lockerIds = asgns.map((a) => a.lockerId);
        const lockers = await Locker.find({ _id: { $in: lockerIds } });
        const data = await flattenLockers(lockers);

        return res.status(200).json({
            message: "Lockers expiring today",
            data,
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in fetching expiring lockers: ${err.message}` });
    }
};

exports.deleteLocker = async (req, res) => {
    try {
        const { lockerNumber } = req.body;

        if (!lockerNumber) {
            return res.status(400).json({ message: "Locker number is required" });
        }

        const flattenedSnapshot = await withAtomic(async (session) => {
            const l = await Locker.findOne({ LockerNumber: lockerNumber }).session(session);
            if (!l) {
                const e = new Error("Locker not found");
                e.status = 400;
                throw e;
            }

            // Capture the shape-preserving snapshot before mutating anything.
            // mergeAssignmentIntoLocker is the pure version of flattenLocker;
            // we query Assignment with the session ourselves so the read is
            // consistent inside the transaction.
            const asgn = await Assignment.findOne({
                lockerId: l._id,
                status: 'active',
                deletedAt: null,
            }).session(session);
            const snapshot = mergeAssignmentIntoLocker(l.toObject(), asgn);

            // End any active Assignment so we don't leave orphans pointing at
            // a nonexistent Locker. A2.0's migration down has an abort rule
            // specifically for orphan Assignments; deleteLocker must clean up.
            await Assignment.updateMany(
                { lockerId: l._id, status: 'active' },
                { $set: { status: 'ended', endedReason: 'cancelled', endedAt: new Date() } },
                { session }
            );

            await Locker.deleteOne({ _id: l._id }).session(session);
            await Issue.deleteMany({ LockerNumber: lockerNumber }).session(session);
            await History.create(
                [{ LockerNumber: lockerNumber, comment: "Locker Deleted", LockerHolder: "N/A", InitiatedBy: "Admin", Cost: 0, LockerStatus: "Deleted" }],
                { session }
            );
            return snapshot;
        });

        return res.status(200).json({
            message: "Locker deleted successfully",
            data: flattenedSnapshot,
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: `Error in deleting Locker: ${err.message}` });
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
    try {
        const { LockerDetails } = req.body;

        if (!LockerDetails || !LockerDetails.LockerNumber) {
            return res.status(400).json({ message: "LockerNumber is required" });
        }

        // Split LockerDetails into locker-config vs assignment fields. The
        // generic $set dump is preserved here for shape-compatibility with
        // the current API; §12 tracks narrowing this endpoint as a Phase 2
        // follow-up.
        const lockerFields = {};
        const assignmentFields = {};
        for (const [k, v] of Object.entries(LockerDetails)) {
            if (k === 'LockerNumber') continue; // the lookup key, not a mutation
            if (ASSIGNMENT_FIELD_SET.has(k)) assignmentFields[k] = v;
            else lockerFields[k] = v;
        }

        // If the payload touches assignment fields but no active Assignment
        // exists for this locker, reject the whole request — silent drops
        // would mean the admin's edits vanish without explanation.
        if (Object.keys(assignmentFields).length > 0) {
            const lockerForCheck = await Locker.findOne({
                LockerNumber: LockerDetails.LockerNumber,
            }).lean();
            if (!lockerForCheck) {
                return res.status(400).json({ message: "Locker not found" });
            }
            const activeAsgnCheck = await Assignment.findOne({
                lockerId: lockerForCheck._id,
                status: 'active',
                deletedAt: null,
            }).lean();
            if (!activeAsgnCheck) {
                const offending = Object.keys(assignmentFields).join(', ');
                return res.status(400).json({
                    message: `Cannot edit assignment fields on an unassigned locker: ${offending}. Allocate the locker first.`,
                });
            }
        }

        const locker = await withAtomic(async (session) => {
            const l = await Locker.findOne({ LockerNumber: LockerDetails.LockerNumber }).session(session);
            if (!l) {
                const e = new Error("Locker not found");
                e.status = 400;
                throw e;
            }

            if (Object.keys(lockerFields).length > 0) {
                await Locker.updateOne(
                    { _id: l._id },
                    { $set: lockerFields },
                    { session }
                );
            }
            if (Object.keys(assignmentFields).length > 0) {
                await Assignment.updateOne(
                    { lockerId: l._id, status: 'active', deletedAt: null },
                    { $set: assignmentFields },
                    { session }
                );
            }

            // Read the post-update Assignment for the History holder/cost —
            // prefer the incoming payload values when present (preserves
            // pre-A2.0.1 behavior where History read LockerDetails.employeeName
            // and l.CostToEmployee).
            const activeAsgn = await Assignment.findOne({
                lockerId: l._id,
                status: 'active',
                deletedAt: null,
            }).session(session);

            let userName = "Admin";
            if (req.user.role !== "Admin") {
                const user = await User.findOne({ email: req.user.email }).session(session);
                userName = user?.name || "System";
            }
            const stat = (l.LockerStatus).charAt(0).toUpperCase() + (l.LockerStatus).slice(1);
            const holderName =
                LockerDetails.employeeName !== undefined
                    ? LockerDetails.employeeName
                    : (activeAsgn ? activeAsgn.employeeName : 'N/A');
            const cost =
                LockerDetails.CostToEmployee !== undefined
                    ? LockerDetails.CostToEmployee
                    : (activeAsgn ? activeAsgn.CostToEmployee : 0);

            await History.create(
                [{ LockerNumber: LockerDetails.LockerNumber, comment: "Locker Details Updated", LockerHolder: holderName, InitiatedBy: userName, Cost: cost, LockerStatus: stat }],
                { session }
            );
            return l;
        });

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
        // Send email to whichever employeeEmail we know — prefer payload,
        // else the (post-update) active Assignment.
        const emailTo =
            LockerDetails.employeeEmail !== undefined
                ? LockerDetails.employeeEmail
                : (await Assignment.findOne({
                      lockerId: locker._id,
                      status: 'active',
                      deletedAt: null,
                  }))?.employeeEmail;
        if (emailTo) {
            await mailSender(emailTo, "Notification of Locker Update", htmlBody);
        }

        return res.status(200).json({ message: "Locker updated successfully" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(err.status || 500).json({ message: `Error in editing Locker: ${err.message}` });
    }
};

exports.changeLockerStatus = async (req, res) => {
    try {
        const { LockerNumber, LockerStatus } = req.body;

        if (!LockerNumber) {
            return res.status(400).json({ message: "LockerNumber is required" });
        }

        await withAtomic(async (session) => {
            const locker = await Locker.findOne({ LockerNumber }).session(session);
            if (!locker) {
                const e = new Error("Locker not found");
                e.status = 400;
                throw e;
            }
            await Locker.updateOne(
                { LockerNumber },
                { $set: { LockerStatus } },
                { session }
            );

            // History's LockerHolder / Cost read from the CURRENT active
            // Assignment (status:'active', deletedAt:null). If no active
            // Assignment exists (e.g. the locker was just cancelled in a
            // prior request), fall back to defaults — does NOT read an
            // ended Assignment's values.
            const activeAsgn = await Assignment.findOne({
                lockerId: locker._id,
                status: 'active',
                deletedAt: null,
            }).session(session);

            let userName = "Admin";
            if (req.user.role !== "Admin") {
                const user = await User.findOne({ email: req.user.email }).session(session);
                userName = user?.name || "System";
            }
            const stat = (LockerStatus).charAt(0).toUpperCase() + (LockerStatus).slice(1);
            await History.create(
                [{
                    LockerNumber,
                    comment: "Locker Status Changed",
                    LockerHolder: activeAsgn ? activeAsgn.employeeName : 'N/A',
                    InitiatedBy: userName,
                    Cost: activeAsgn ? activeAsgn.CostToEmployee : 0,
                    LockerStatus: stat,
                }],
                { session }
            );
        });

        return res.status(200).json({ message: "Locker updated successfully" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(err.status || 500).json({ message: `Error in editing Locker: ${err.message}` });
    }
};

exports.updateMultipleLockerPrices = async (req, res) => {
    try {
        const { LockerPrice3Month, LockerPrice6Month, LockerPrice12Month, availableForGender, LockerType } = req.body;

        if (!availableForGender || !['male', 'female'].includes(availableForGender.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid gender. Must be "male" or "female".' });
        }

        const updateData = {};
        if (LockerPrice3Month) updateData['LockerPrice3Month'] = LockerPrice3Month;
        if (LockerPrice6Month) updateData['LockerPrice6Month'] = LockerPrice6Month;
        if (LockerPrice12Month) updateData['LockerPrice12Month'] = LockerPrice12Month;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'At least one price must be provided (3, 6, or 12 months).' });
        }

        const result = await withAtomic(async (session) => {
            const r = await Locker.updateMany(
                { availableForGender, LockerType },
                { $set: updateData },
                { session }
            );
            await Price.updateOne(
                { availableForGender, LockerType },
                { $set: updateData },
                { upsert: true, session }
            );
            return r;
        });

        return res.status(200).json({
            message: 'Locker prices updated successfully.',
            updatedCount: result.nModified
        });
    } catch (error) {
        console.error('Error updating locker prices:', error);
        return res.status(error.status || 500).json({ error: 'Internal server error' });
    }
};
