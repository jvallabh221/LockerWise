const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel.js');
const Locker = require('../../models/lockerModel.js');

let userCounter = 0;
let lockerCounter = 0;

async function createTestUser({
    role = 'Admin',
    password = 'TestPass1!',
    email,
    name = 'Test User',
    gender = 'Other',
    phoneNumber,
} = {}) {
    userCounter += 1;
    const resolvedEmail = email || `test-user-${userCounter}-${Date.now()}@example.com`;
    const resolvedPhone = phoneNumber || `555${String(Date.now()).slice(-4)}${userCounter}`;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email: resolvedEmail,
        role,
        gender,
        phoneNumber: resolvedPhone,
        password: hashed,
    });
    return { user, plainPassword: password };
}

async function createTestLocker({
    status = 'available',
    lockerNumber,
    lockerType = 'half',
    gender = 'Male',
} = {}) {
    lockerCounter += 1;
    const resolvedNumber = lockerNumber ?? (1000000 + lockerCounter);
    return Locker.create({
        LockerType: lockerType,
        LockerStatus: status,
        LockerNumber: resolvedNumber,
        availableForGender: gender,
    });
}

function createAuthHeader(user) {
    const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
    );
    return { Authorization: `Bearer ${token}` };
}

module.exports = { createTestUser, createTestLocker, createAuthHeader };
