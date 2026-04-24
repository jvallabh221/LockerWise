const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const compression = require('compression');

const userRoute = require('./routes/authRoutes.js');
const adminRoute = require('./routes/adminRoutes.js');
const resetPasswordRoute = require('./routes/resetPasswordRoute.js');
const lockerRoute = require('./routes/lockerRoutes.js');
const issueRoute = require('./routes/issueRoute.js');
const profileRoute = require('./routes/profileRoutes.js');
const contactRoute = require('./routes/contactRoute.js');

const defaultOrigins = [
    "https://lockerwise-app.lockerwise.com",
    "https://frontend-test-ten-pi.vercel.app",
    "http://localhost:5173",
];

function createApp() {
    const app = express();

    app.use(compression());
    app.use(express.json());

    const corsOrigins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
        : defaultOrigins;

    app.use(cors({
        origin: corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.use('/api/user', userRoute);
    app.use('/api/admin', adminRoute);
    app.use('/api/resetPassword', resetPasswordRoute);
    app.use('/api/locker', lockerRoute);
    app.use('/api/issue', issueRoute);
    app.use('/api/profile', profileRoute);
    app.use('/api/contact', contactRoute);

    const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
    if (fs.existsSync(frontendDist)) {
        app.use(express.static(frontendDist));
        app.get(/^\/(?!api\/).*/, (req, res) => {
            res.sendFile(path.join(frontendDist, 'index.html'));
        });
    } else {
        app.get('/', (req, res) => {
            res.send('Welcome to the backend! (frontend build not found)');
        });
    }

    return app;
}

module.exports = createApp;
