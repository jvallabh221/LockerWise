const express = require('express')
const dbConnect = require('./utils/databaseConnect.js')
const cors = require('cors');
const userroute = require('./routes/authRoutes.js')
const adminRoute = require('./routes/adminRoutes.js')
const resetPasswordRoute = require('./routes/resetPasswordRoute.js')
const lockerRoute = require('./routes/lockerRoutes.js')
const issueRoute = require('./routes/issueRoute.js')
const profileRoute = require('./routes/profileRoutes.js')
const contactRoute = require('./routes/contactRoute.js')
require('dotenv').config();
const mailSender = require('./utils/mailSender.js')
const cron = require('node-cron');
const Locker = require('./models/lockerModel.js')
const app = express();
const compression = require('compression');
const History = require('./models/History.js');

app.use(compression());
app.use(express.json());
const defaultOrigins = [
    "https://lockerwise-app.lockerwise.com",
    "https://frontend-test-ten-pi.vercel.app",
    "http://localhost:5173",
];

const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : defaultOrigins;

app.use(cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

async function startServer() {
    try {
        await dbConnect();
        app.listen(process.env.PORT, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error(`Error Connecting To DB: ${error.message}`);
    }
}

startServer();

app.use('/api/user', userroute);
app.use('/api/admin', adminRoute);
app.use('/api/resetPassword', resetPasswordRoute);
app.use('/api/locker', lockerRoute);
app.use('/api/issue', issueRoute);
app.use('/api/profile', profileRoute);
app.use('/api/contact', contactRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

function formatdate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
};


cron.schedule('0 0 * * *', async () => { // Runs daily at 12:00 AM
    try {
        const startOfTodayUTC = new Date();
        startOfTodayUTC.setHours(0, 0, 0, 0);
        const endOfTodayUTC = new Date();
        endOfTodayUTC.setHours(23, 59, 59, 999); // End of UTC day

        // console.log("Querying lockers with:", { startOfTodayUTC, endOfTodayUTC });

        const data = await Locker.find({
            expiresOn: { $gte: startOfTodayUTC, $lte: endOfTodayUTC },
            emailSent: { $ne: true },
        });

        for (const locker of data) {
            const email = locker.employeeEmail;
            const name = locker.employeeName;
            const lockerNumber = locker.LockerNumber
            const startDate = locker.StartDate;
            const endDate = locker.EndDate;
            const duration = locker.Duration
            const currentDate = new Date()
            const formatted = formatdate(currentDate)
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
            if (email) {
                try {
                    await mailSender(email, "Locker Expiration Notification", htmlBody);
                    // Mark email as sent for this locker
                    locker.emailSent = true;
                    await locker.save();
                } catch (emailError) {
                    console.error(`Error sending email to ${email}: ${emailError.message}`);
                }
            } else {
                console.warn(`No email found for locker ${locker._id}`);
            }
        }
    } catch (err) {
        console.error(`Error in fetching lockers expiring today: ${err.message}`);
    }
});

cron.schedule('1 0 * * *', async () => { //Runs daily at 12:01 AM
    try {
        const nowUTC = new Date();
        nowUTC.setHours(nowUTC.getHours(), nowUTC.getMinutes(), nowUTC.getSeconds(), nowUTC.getMilliseconds()); // Current UTC time
        const lockersToUpdate = await Locker.find({
            expiresOn: { $lte: nowUTC },
            LockerStatus: { $ne: "expired" }
        });

        for (const locker of lockersToUpdate) {
            locker.LockerStatus = "expired"; // Set status to "expired"
            await locker.save(); // Save the updated locker
            console.log(`Time : ${Date()} and Locker ${locker.LockerNumber} status set to "expired".`);
        }
    } catch (err) {
        console.error(`Error in updating locker statuses: ${err.message}`);
    }
});

cron.schedule('2 0 * * *', async () => { // Runs daily at 12:02 AM
    try {
        const todayUTC = new Date();
        todayUTC.setHours(0, 0, 0, 0); // Start of UTC day
        const threeMonthsAgo = new Date(todayUTC);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3); // Subtract 3 months

        const result = await History.deleteMany({
            createdAt: { $lte: threeMonthsAgo }
        });

        console.log(`${result.deletedCount} history records older than 3 months deleted.`);
    } catch (err) {
        console.error(`Error in deleting old history records: ${err.message}`);
    }
});
