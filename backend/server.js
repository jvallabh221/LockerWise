require('dotenv').config();
const cron = require('node-cron');
const createApp = require('./createApp.js');
const dbConnect = require('./utils/databaseConnect.js');
const History = require('./models/History.js');
const sendExpiryEmails = require('./jobs/sendExpiryEmails.js');
const markExpiredAssignments = require('./jobs/markExpiredAssignments.js');

const app = createApp();

async function startServer() {
    try {
        await dbConnect();
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        });
    } catch (error) {
        console.error(`Error Connecting To DB: ${error.message}`);
    }
}

// Daily at 12:00 AM — email holders whose Assignment expires today.
cron.schedule('0 0 * * *', async () => {
    try {
        const result = await sendExpiryEmails();
        console.log(
            `sendExpiryEmails: considered=${result.considered}, sent=${result.sent}`,
        );
    } catch (err) {
        console.error(`Error in sendExpiryEmails: ${err.message}`);
    }
});

// Daily at 12:01 AM — mark expired Assignments and their Lockers.
cron.schedule('1 0 * * *', async () => {
    try {
        const result = await markExpiredAssignments();
        console.log(
            `markExpiredAssignments: considered=${result.considered}, marked=${result.marked}`,
        );
    } catch (err) {
        console.error(`Error in markExpiredAssignments: ${err.message}`);
    }
});

// Daily at 12:02 AM — prune History older than 3 months. Unrelated to
// Assignment extraction; kept inline pending the broader C10 cron audit.
cron.schedule('2 0 * * *', async () => {
    try {
        const todayUTC = new Date();
        todayUTC.setHours(0, 0, 0, 0);
        const threeMonthsAgo = new Date(todayUTC);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const result = await History.deleteMany({
            createdAt: { $lte: threeMonthsAgo },
        });

        console.log(
            `${result.deletedCount} history records older than 3 months deleted.`,
        );
    } catch (err) {
        console.error(`Error in deleting old history records: ${err.message}`);
    }
});

startServer();
