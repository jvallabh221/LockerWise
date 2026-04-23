require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/userModel.js')
const Issue = require('../models/Issue.js')
const Locker = require('../models/lockerModel.js')
const History = require('../models/History.js')
const mailSender = require('../utils/mailSender.js')

const generateEmailBody = (type,message) => `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.6;">
      
                <div style="text-align: center; margin-bottom: 20px;">
                    <img 
                    src="${process.env.IMG_LINK}" 
                    alt="Company Logo" 
                    style="width: 500px; height: auto;" 
                    />
                </div>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    ${message} 
                </p>
                <p style="font-size: 16px; color: #333; margin: 0;">
                    Best regards,<br />
                    <strong>DraconX Pvt. Ltd</strong>,<br/>  
                    <strong>"From Vision to Validation, faster"</strong>
                </p>
            </div>
        `;

exports.raiseTechnicalIssue = async (req, res) => {
    try {
        const { subject, description, email } = req.body;

        const issue = await Issue.create({ subject, description, type: 'technical', email });

        await issue.save();

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
                    You have raised a <b>Techincal Issue </b> request.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    If this request was not requested by you or if you have any concerns, please contact us immediately.
                </p>
                <p style="font-size: 16px; color: #333; margin: 0;">
                    Best regards,<br />
                    <strong>DraconX Pvt. Ltd</strong>,<br/>  
                    <strong>"From Vision to Validation, faster"</strong>
                </p>
            </div>
        `;

        await mailSender(email, "Confirmation of Issue Reporting", htmlBody);

        return res.status(201).json({ message: "Technical issue raised  successfully", issue });
    } catch (err) {
        return res.status(err.status || 500).json({ message : `Error in raising Issue: ${err.message}`});
    }
};

exports.raiseLockerIssue = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { subject, description, LockerNumber } = req.body;
        let { email } = req.body;

        const locker = await Locker.findOne({ LockerNumber: LockerNumber }).session(session);

        if (!locker) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Locker not found" });
        }

        if(!email) {
            email = "None";
        }

        // Use array syntax for create() when using sessions
        const [issue] = await Issue.create([{ subject, description, type: 'locker', LockerNumber, email }], { session });

        let userName = "Admin";
        if(req.user.role !== "Admin"){
            const user = await User.findOne({ email: req.user.email }).session(session);
            userName = user.name;
        }

        const stat = (locker.LockerStatus).charAt(0).toUpperCase() + (locker.LockerStatus).slice(1);

        // Use array syntax for create() when using sessions
        await History.create([{ LockerNumber: LockerNumber, comment: "Issue Raised", LockerHolder: locker.employeeName, InitiatedBy: userName, Cost: locker.CostToEmployee, LockerStatus: stat }], { session });

        // Commit transaction if all operations succeed
        await session.commitTransaction();

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
                    You have raised a <b>Locker Issue </b>request for <strong>Locker number : ${issue.LockerNumber}</strong>.
                </p>
                
                <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                    If this request was not requested by you or if you have any concerns, please contact us immediately.
                </p>

                <p style="font-size: 16px; color: #333; margin: 0;">
                    Best regards,<br />
                    <strong>DraconX Pvt. Ltd</strong>,<br/>  
                    <strong>"From Vision to Validation, faster"</strong>
                </p>

            </div>
        `;

        if(email!=="None")   await mailSender(email, "Confirmation of Issue Reporting", htmlBody);

        return res.status(201).json({ message: "Locker issue raised  successfully", issue });
    } catch (err) {
        // Rollback transaction on error
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message : `Error in raising Issue: ${err.message}`});
    } finally {
        // Always end the session
        session.endSession();
    }
};

exports.getAllIssues = async (req, res) => {
    try {
        const lockerIssue = await Issue.find({"type":"locker"});
        const technicalIssue = await Issue.find({"type":"technical"});
        const data = { lockerIssue, technicalIssue };
        return res.status(200).json({ message: " issues fetched successfully", data });
    } catch (err) { 
        return res.status(err.status || 500).json({ message : `Error in fetching issues: ${err.message}`});
    }
}

exports.updateComment = async (req, res) => {
    try {
        const { id, comment } = req.body;  // Expecting id of the issue and the new comment in the request body
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        issue.comment = comment;
        await issue.save();
        return res.status(200).json({ message: "Comment updated successfully", issue });
    } catch (err) {
        return res.status(err.status || 500).json({ message : `Error in updating comment: ${err.message}`});
    }
};

exports.updateIssue = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id, status } = req.body;
        const issue = await Issue.findByIdAndUpdate(id, {status:status}, { session, new: true });
        
        if (!issue) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Issue not found" });
        }
        
        let message = "";
        
        issue.type == "technical" ? message = "Your <b>Technical</b> issue is being <b>Processed</b>. We will keep you updated on the progress."
                                  : message = "Your <b>Locker</b> issue for the Locker Number <strong><u>" + issue.LockerNumber + "</u></strong> is being <b>Processed</b>.<br>We will keep you updated on the progress.";
         const htmlBody = generateEmailBody(
            "Update",
            message
        );
        
        if( issue.type == "locker" ){
            const locker = await Locker.findOne({ LockerNumber: issue.LockerNumber }).session(session);
            if (!locker) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "Locker not found" });
            }
            const stat = (locker.LockerStatus).charAt(0).toUpperCase() + (locker.LockerStatus).slice(1);
            await History.create([{ LockerNumber: issue.LockerNumber, comment: "Issue Processed", LockerHolder: locker.employeeName, InitiatedBy: "Admin", Cost:  locker.CostToEmployee, LockerStatus: stat }], { session });
        }

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        if(issue.email!=="None")  await mailSender(issue.email, "Update On Your Issue", htmlBody);

        return res.status(200).json({ message: "action initiated", issue });
    } catch (err) {
        // Rollback transaction on error
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message : `Error in updating Issue: ${err.message}`});
    } finally {
        // Always end the session
        session.endSession();
    }
};

exports.resolveIssue = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id, status } = req.body;
        const issue = await Issue.findByIdAndUpdate(id, {status:status}, { session, new: true });
        
        if (!issue) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Issue not found" });
        }
        
        let message = "";
        
        issue.type == "technical" ? message = "Your <b>Technical</b> issue has been <b>Resolved</b>. Thank you for your patience."
                                  : message = "Your <b>Locker</b> issue for the Locker Number <strong><u>" + issue.LockerNumber + "</u></strong> has been <b>Resolved</b>.<br>Thank you for your patience.";
         const htmlBody = generateEmailBody(
            "Update",
            message
        );

        if( issue.type == "locker" ){
            const locker = await Locker.findOne({ LockerNumber: issue.LockerNumber }).session(session);
            if (!locker) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "Locker not found" });
            }
            const stat = (locker.LockerStatus).charAt(0).toUpperCase() + (locker.LockerStatus).slice(1);
            await History.create([{ LockerNumber: issue.LockerNumber, comment: "Issue Resolved", LockerHolder: locker.employeeName, InitiatedBy: "Admin", Cost: locker.CostToEmployee, LockerStatus: stat }], { session });
        }

        // Commit transaction if all operations succeed
        await session.commitTransaction();

        if(issue.email!=="None")  await mailSender(issue.email, "Issue has been Resolved", htmlBody);
        return res.status(200).json({ message: "Issue resolved  successfully", issue });
    } catch (err) {
        // Rollback transaction on error
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message : `Error in resolving Issue: ${err.message}`});
    } finally {
        // Always end the session
        session.endSession();
    }
};

exports.deleteIssue = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {id} = req.body;
        const issue = await Issue.findById(id).session(session);
        if (!issue) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Issue not found" });
        }
        
        await Issue.findByIdAndDelete(id).session(session);

        const user = await User.findOne({ email: req.user.email }).session(session);
        
        if(issue.type == "locker"){
            const locker = await Locker.findOne({ LockerNumber: issue.LockerNumber }).session(session);
            if (!locker) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "Locker not found" });
            }
            const stat = (locker.LockerStatus).charAt(0).toUpperCase() + (locker.LockerStatus).slice(1);
            await History.create([{ LockerNumber: issue.LockerNumber, comment: "Issue Deleted", LockerHolder: locker.employeeName, InitiatedBy: user.name, Cost:  locker.CostToEmployee, LockerStatus: stat}], { session });
        }
        
        // Commit transaction if all operations succeed
        await session.commitTransaction();
        
        return res.status(200).json({ message: "Issue deleted successfully", issue });

    } catch (err) {
        // Rollback transaction on error
        await session.abortTransaction();
        return res.status(err.status || 500).json({ message : `Error in deleting Issue: ${err.message}`});
    } finally {
        // Always end the session
        session.endSession();
    }
};