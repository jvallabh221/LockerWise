// authRoute.js
const express = require('express');

const router = express.Router();
const { login, LogOut } = require('../controllers/authController.js');
const verifyToken=require('../utils/verifyUser.js')

router.post('/login', login);
router.post('/logOut',verifyToken(['Admin','Staff']), LogOut);

module.exports = router;