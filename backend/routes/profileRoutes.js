// authRoute.js
const express = require('express');
const router = express.Router();
const verifyToken=require('../utils/verifyUser.js')

const { updateProfile, changePassword } = require('../controllers/profileController.js');

router.put('/changePassword',verifyToken(['Admin','Staff']), changePassword);
router.put('/updateProfile',verifyToken(['Admin','Staff']), updateProfile);

module.exports = router;       