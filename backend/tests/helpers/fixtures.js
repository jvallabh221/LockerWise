const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/userModel.js');
const Locker = require('../../models/lockerModel.js');
const Assignment = require('../../models/assignmentModel.js');

let userCounter = 0;
let lockerCounter = 0;
let assignmentCounter = 0;

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
    buildingId,
    floorId,
} = {}) {
    lockerCounter += 1;
    const resolvedNumber = lockerNumber ?? (1000000 + lockerCounter);
    // A1 added a pre-save warning that fires when buildingId is missing.
    // Default to a fresh mock ObjectId so the fixture doesn't spam CI logs.
    // The mock has no corresponding Building doc — the warning still fires
    // for real controller omissions (i.e. non-fixture callers that forget
    // to set buildingId), which is the signal A5.1 needs.
    const resolvedBuildingId = buildingId ?? new mongoose.Types.ObjectId();
    const resolvedFloorId = floorId ?? new mongoose.Types.ObjectId();
    return Locker.create({
        LockerType: lockerType,
        LockerStatus: status,
        LockerNumber: resolvedNumber,
        availableForGender: gender,
        buildingId: resolvedBuildingId,
        floorId: resolvedFloorId,
    });
}

async function createTestAssignment({
    lockerId,
    employeeName,
    employeeId,
    employeeEmail,
    employeePhone,
    employeeGender = 'Male',
    costToEmployee = 100,
    duration = '3',
    startDate,
    endDate,
    expiresOn,
    emailSent = false,
    status = 'active',
} = {}) {
    if (!lockerId) {
        throw new Error('createTestAssignment requires lockerId');
    }
    assignmentCounter += 1;
    const now = new Date();
    const resolvedStart = startDate ?? now;
    const resolvedEnd =
        endDate ?? new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const resolvedExpires = expiresOn ?? resolvedEnd;
    return Assignment.create({
        lockerId,
        employeeName: employeeName ?? `Test Employee ${assignmentCounter}`,
        employeeId: employeeId ?? `EMP-${assignmentCounter}`,
        employeeEmail:
            employeeEmail ?? `test-employee-${assignmentCounter}@example.com`,
        employeePhone: employeePhone ?? `555000${assignmentCounter}`,
        employeeGender,
        CostToEmployee: costToEmployee,
        Duration: duration,
        StartDate: resolvedStart,
        EndDate: resolvedEnd,
        expiresOn: resolvedExpires,
        emailSent,
        status,
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

module.exports = {
    createTestUser,
    createTestLocker,
    createTestAssignment,
    createAuthHeader,
};
