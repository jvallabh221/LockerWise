require('dotenv').config();

const User = require('../models/userModel.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const validUser = await User.findOne({ email });

	

        if (!validUser) {
            return res.status(404).json({ message : "!!! No User Exists !!!" });
        }                             
                             
        const hashedPassword = validUser.password;
        const validPassword = await bcrypt.compare(password, hashedPassword);
        if (!validPassword) {
            return res.status(401).json({ message : "Invalid email or Password" });
        }                                     

        const payload = {


            email: validUser.email,
            id: validUser._id,
            role: validUser.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "12h",
        });

        const userWithToken = { ...validUser.toObject(), token };

        const { password: pass, ...rest } = userWithToken;

        return res.status(200).json(rest);
    } catch (err) {
        return res.status(err.status || 500).json({ message : `Error in Log in: ${err.message}` });
    }
};

exports.LogOut = async (req, res) => {
    try {
        res.status(200).json('User has been logged out !');
    }
    catch (err) {
       return res.status(err.status || 500).json({ message : `Error in Log out: ${err.message}` });
    }
};
