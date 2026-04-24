// A2.0 cron job 1: email the holder of any Assignment expiring today.
//
// Must query Assignment (not Locker) so that A2.0.1's $unset of expiresOn
// / emailSent from Locker doesn't silently stop the email flow.
//
// The day-boundary math still uses the server's local time, which on
// Railway is UTC but is NOT guaranteed to be — C10 fixes this for all
// three cron jobs. Redirecting the query target to Assignment in A2.0
// leaves the TZ bug in place, but moves it to the right collection
// so C10 only has to fix the math, not the data source.
//
// mailer is injectable so tests can substitute a spy without mocking the
// module system. Default resolves to the shared nodemailer wrapper.

const defaultMailer = require('../utils/mailSender.js');
const Assignment = require('../models/assignmentModel.js');

function formatdate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

function renderHtmlBody({ name, lockerNumber, startDate, endDate, duration, now }) {
    const formatted = formatdate(now);
    return `
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
                  We want to notify you that the locker assigned to you is expiring <b>Today</b>(${formatted}). Below are the details of the locker:
              </p>


              <p style="font-size: 16px; color: #333; font-weight: bold; margin: 0 0 10px 0;">
                  Locker Details:
              </p>
              <ul style="font-size: 16px; padding-left: 20px; margin: 0 0 15px 0; color: #333;">
                  <li><strong>Locker Number:</strong> ${lockerNumber}</li>
                  <li><strong>Original Validity Period:</strong> ${duration === "customize" ? `${formatdate(startDate)} to ${formatdate(endDate)}` : `${duration} Months`}</li>
              </ul>


              <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                  If you require a locker in the future, please submit a new request through the Locker Management System or contact us at <strong>[Support Email/Phone]</strong>.
              </p>
              <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                  We appreciate your cooperation and thank you for using our locker management service.
              </p>
              <p style="font-size: 16px; color: #333; margin: 0;">
                  Best regards,<br />
                  <strong>DraconX Pvt. Ltd</strong>,<br/>
                  <strong>"From Vision to Validation, faster"</strong>
              </p>
          </div>
          `;
}

async function sendExpiryEmails({ now = new Date(), mailer = defaultMailer } = {}) {
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const assignments = await Assignment.find({
        expiresOn: { $gte: startOfToday, $lte: endOfToday },
        emailSent: { $ne: true },
        status: 'active',
    }).populate('lockerId');

    let sent = 0;
    for (const asgn of assignments) {
        const email = asgn.employeeEmail;
        if (!email) {
            console.warn(`No employeeEmail on Assignment ${asgn._id} — skipping`);
            continue;
        }
        const lockerNumber = asgn.lockerId ? asgn.lockerId.LockerNumber : 'N/A';
        const htmlBody = renderHtmlBody({
            name: asgn.employeeName,
            lockerNumber,
            startDate: asgn.StartDate,
            endDate: asgn.EndDate,
            duration: asgn.Duration,
            now,
        });
        try {
            await mailer(email, 'Locker Expiration Notification', htmlBody);
            asgn.emailSent = true;
            await asgn.save();
            sent += 1;
        } catch (emailError) {
            console.error(`Error sending email to ${email}: ${emailError.message}`);
        }
    }

    return { considered: assignments.length, sent };
}

module.exports = sendExpiryEmails;
