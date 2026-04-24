// A2.0.1 integration tests for lockerController. One test file per commit
// won't scale — this file grows across commits 3-7 as each endpoint is
// rewritten. Keep assertions grouped by endpoint (describe blocks).

const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../../../createApp.js');
const Locker = require('../../../models/lockerModel.js');
const Assignment = require('../../../models/assignmentModel.js');
const History = require('../../../models/History.js');
const {
    createTestUser,
    createTestLocker,
    createAuthHeader,
} = require('../../helpers/fixtures.js');
const { installMailMock } = require('../../helpers/mockMailer.js');

let app;
let mail;

beforeAll(() => {
    app = createApp();
});

beforeEach(() => {
    mail = installMailMock();
});

afterEach(() => {
    mail.restore();
});

// Shape contract: these 11 fields must always appear in a Locker API
// response body, sourced from Assignment (active) or flatten DEFAULTS.
const SHAPE_FIELDS = [
    'employeeName',
    'employeeId',
    'employeeEmail',
    'employeePhone',
    'employeeGender',
    'CostToEmployee',
    'Duration',
    'StartDate',
    'EndDate',
    'expiresOn',
    'emailSent',
];

describe('POST /api/locker/allocateLocker', () => {
    async function callAllocate(staffUser, body) {
        return request(app)
            .post('/api/locker/allocateLocker')
            .set(createAuthHeader(staffUser))
            .send(body);
    }

    it('creates an Assignment, updates Locker config, returns flat shape', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        const locker = await createTestLocker({
            status: 'available',
            lockerNumber: 4001,
            lockerType: 'half',
            gender: 'Female',
        });

        const res = await callAllocate(staff, {
            lockerNumber: 4001,
            lockerType: 'full',
            lockerCode: 'A-123',
            employeeName: 'Alice',
            employeeId: 'E-1',
            employeeEmail: 'alice@example.com',
            employeePhone: '5551111',
            employeeGender: 'Female',
            costToEmployee: 150,
            duration: '3',
            startDate: '2026-04-24',
            endDate: '2026-07-24',
        });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Locker allocated successfully');

        // Shape preservation: all 11 assignment fields present on the data object.
        for (const f of SHAPE_FIELDS) {
            expect(res.body.data).toHaveProperty(f);
        }
        expect(res.body.data.employeeName).toBe('Alice');
        expect(res.body.data.employeeEmail).toBe('alice@example.com');
        expect(res.body.data.CostToEmployee).toBe(150);
        expect(res.body.data.Duration).toBe('3');
        expect(res.body.data.emailSent).toBe(false);

        // Locker doc: config fields updated; old 11 fields NOT written by the new allocate.
        const lockerDb = await Locker.findById(locker._id).lean();
        expect(lockerDb.LockerCode).toBe('A-123');
        expect(lockerDb.LockerType).toBe('full');
        expect(lockerDb.LockerStatus).toBe('occupied');

        // Assignment doc: all 11 fields set, status active.
        const asgnDb = await Assignment.findOne({ lockerId: locker._id });
        expect(asgnDb).toBeTruthy();
        expect(asgnDb.status).toBe('active');
        expect(asgnDb.employeeName).toBe('Alice');
        expect(asgnDb.employeeId).toBe('E-1');
        expect(asgnDb.employeeEmail).toBe('alice@example.com');
        expect(asgnDb.employeePhone).toBe('5551111');
        expect(asgnDb.employeeGender).toBe('Female');
        expect(asgnDb.CostToEmployee).toBe(150);
        expect(asgnDb.Duration).toBe('3');
        expect(asgnDb.emailSent).toBe(false);
    });

    it('creates a History entry with LockerHolder and Cost from the request', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff', name: 'Staff1' });
        await createTestLocker({ lockerNumber: 4002, status: 'available' });

        await callAllocate(staff, {
            lockerNumber: 4002,
            lockerType: 'full',
            lockerCode: 'A-124',
            employeeName: 'Bob',
            employeeId: 'E-2',
            employeeEmail: 'bob@example.com',
            employeePhone: '5552222',
            employeeGender: 'Male',
            costToEmployee: 200,
            duration: '6',
            startDate: '2026-04-24',
            endDate: '2026-10-24',
        });

        const history = await History.findOne({ LockerNumber: 4002, comment: 'Allocated Successfully' });
        expect(history).toBeTruthy();
        expect(history.LockerHolder).toBe('Bob');
        expect(history.Cost).toBe(200);
        expect(history.InitiatedBy).toBe('Staff1');
        expect(history.LockerStatus).toBe('Occupied');
    });

    it('sends the allocation email via the mocked mailer', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        await createTestLocker({ lockerNumber: 4003, status: 'available' });

        await callAllocate(staff, {
            lockerNumber: 4003,
            lockerType: 'full',
            lockerCode: 'A-125',
            employeeName: 'Carol',
            employeeId: 'E-3',
            employeeEmail: 'carol@example.com',
            employeePhone: '5553333',
            employeeGender: 'Female',
            costToEmployee: 100,
            duration: '3',
        });

        expect(mail.sendMail).toHaveBeenCalledTimes(1);
        expect(mail.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'carol@example.com',
                subject: expect.stringContaining('Locker Assignment'),
            }),
        );
    });

    it('returns 400 when lockerNumber is missing', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        const res = await callAllocate(staff, { employeeName: 'X' });
        expect(res.status).toBe(400);
    });

    it('returns 400 when the locker is not available', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        await createTestLocker({ lockerNumber: 4004, status: 'occupied' });

        const res = await callAllocate(staff, {
            lockerNumber: 4004,
            lockerType: 'full',
            employeeName: 'Eve',
            employeeId: 'E-4',
            employeeEmail: 'eve@example.com',
            employeePhone: '5554444',
            employeeGender: 'Female',
            costToEmployee: 100,
            duration: '3',
        });
        expect(res.status).toBe(400);

        // No Assignment created.
        const asgnCount = await Assignment.countDocuments({});
        expect(asgnCount).toBe(0);
    });

    it('returns 401 without an auth token', async () => {
        const res = await request(app)
            .post('/api/locker/allocateLocker')
            .send({ lockerNumber: 4005 });
        expect(res.status).toBe(401);
    });
});

describe('PUT /api/locker/renewLocker', () => {
    async function callRenew(staffUser, body) {
        return request(app)
            .put('/api/locker/renewLocker')
            .set(createAuthHeader(staffUser))
            .send(body);
    }

    async function setupAssignedLocker(overrides = {}) {
        const { createTestAssignment } = require('../../helpers/fixtures.js');
        const locker = await createTestLocker({
            status: 'occupied',
            lockerNumber: overrides.lockerNumber ?? 4100,
        });
        const asgn = await createTestAssignment({
            lockerId: locker._id,
            employeeName: overrides.employeeName ?? 'Alice',
            employeeEmail: overrides.employeeEmail ?? 'alice@example.com',
            costToEmployee: overrides.costToEmployee ?? 100,
            duration: overrides.duration ?? '3',
            emailSent: overrides.emailSent ?? true,
        });
        return { locker, asgn };
    }

    it('updates the active Assignment, preserves shape, sets emailSent=false', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        const { locker, asgn } = await setupAssignedLocker({ lockerNumber: 4101 });

        const res = await callRenew(staff, {
            lockerNumber: 4101,
            EmployeeEmail: 'alice@example.com',
            costToEmployee: 250,
            duration: '6',
            startDate: '2026-05-01',
            endDate: '2026-11-01',
        });

        expect(res.status).toBe(200);
        for (const f of SHAPE_FIELDS) {
            expect(res.body.data).toHaveProperty(f);
        }
        expect(res.body.data.employeeName).toBe('Alice');
        expect(res.body.data.CostToEmployee).toBe(250);
        expect(res.body.data.Duration).toBe('6');
        expect(res.body.data.emailSent).toBe(false);

        const asgnDb = await Assignment.findById(asgn._id);
        expect(asgnDb.CostToEmployee).toBe(250);
        expect(asgnDb.Duration).toBe('6');
        expect(asgnDb.emailSent).toBe(false);
        expect(asgnDb.status).toBe('active');

        // Locker status reset to occupied (important if it had been 'expired').
        const lockerDb = await Locker.findById(locker._id).lean();
        expect(lockerDb.LockerStatus).toBe('occupied');
    });

    it('renews an expired locker back to occupied status', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        const { locker } = await setupAssignedLocker({
            lockerNumber: 4102,
            employeeEmail: 'bob@example.com',
        });
        // Simulate the expiry cron having flipped the Locker to 'expired'.
        await Locker.updateOne({ _id: locker._id }, { LockerStatus: 'expired' });

        const res = await callRenew(staff, {
            lockerNumber: 4102,
            EmployeeEmail: 'bob@example.com',
            costToEmployee: 200,
            duration: '12',
        });

        expect(res.status).toBe(200);
        const lockerDb = await Locker.findById(locker._id).lean();
        expect(lockerDb.LockerStatus).toBe('occupied');
    });

    it('returns 400 when the holder email is not on any active Assignment', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        const res = await callRenew(staff, {
            lockerNumber: 4103,
            EmployeeEmail: 'nonexistent@example.com',
            costToEmployee: 100,
            duration: '3',
        });
        expect(res.status).toBe(400);
    });

    it('returns 400 when lockerNumber does not match the Assignment lockup', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        await setupAssignedLocker({
            lockerNumber: 4104,
            employeeEmail: 'carol@example.com',
        });

        const res = await callRenew(staff, {
            lockerNumber: 9999,
            EmployeeEmail: 'carol@example.com',
            costToEmployee: 100,
            duration: '3',
        });
        expect(res.status).toBe(400);
    });

    it('writes a History "Locker Renewed" entry with the updated cost', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff', name: 'Staff2' });
        await setupAssignedLocker({
            lockerNumber: 4105,
            employeeEmail: 'dave@example.com',
            employeeName: 'Dave',
        });

        await callRenew(staff, {
            lockerNumber: 4105,
            EmployeeEmail: 'dave@example.com',
            costToEmployee: 300,
            duration: '12',
        });

        const history = await History.findOne({ LockerNumber: 4105, comment: 'Locker Renewed' });
        expect(history).toBeTruthy();
        expect(history.LockerHolder).toBe('Dave');
        expect(history.Cost).toBe(300);
        expect(history.InitiatedBy).toBe('Staff2');
    });
});

describe('POST /api/locker/cancelLocker', () => {
    const { createTestAssignment } = require('../../helpers/fixtures.js');

    async function callCancel(staffUser, body) {
        return request(app)
            .post('/api/locker/cancelLocker')
            .set(createAuthHeader(staffUser))
            .send(body);
    }

    async function setupAssignedLocker(overrides = {}) {
        const locker = await createTestLocker({
            status: 'occupied',
            lockerNumber: overrides.lockerNumber ?? 4200,
        });
        const asgn = await createTestAssignment({
            lockerId: locker._id,
            employeeName: overrides.employeeName ?? 'Alice',
            employeeEmail: overrides.employeeEmail ?? 'alice@example.com',
            costToEmployee: overrides.costToEmployee ?? 150,
        });
        return { locker, asgn };
    }

    it('ends the active Assignment, sets Locker to available, returns default-shaped response', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        const { locker, asgn } = await setupAssignedLocker({ lockerNumber: 4201 });

        const res = await callCancel(staff, {
            lockerNumber: 4201,
            EmployeeEmail: 'alice@example.com',
        });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Locker taken back successfully');
        // After cancel, flatten returns defaults — matches pre-A2.0.1 reset behavior.
        expect(res.body.data.employeeName).toBe('N/A');
        expect(res.body.data.employeeEmail).toBe('');
        expect(res.body.data.employeeGender).toBe('None');
        expect(res.body.data.CostToEmployee).toBe(0);
        expect(res.body.data.Duration).toBe('');
        expect(res.body.data.StartDate).toBe('');
        expect(res.body.data.emailSent).toBe(false);
        // All 11 fields present in the response.
        for (const f of SHAPE_FIELDS) {
            expect(res.body.data).toHaveProperty(f);
        }

        const asgnDb = await Assignment.findById(asgn._id);
        expect(asgnDb.status).toBe('ended');
        expect(asgnDb.endedReason).toBe('cancelled');
        expect(asgnDb.endedAt).toBeInstanceOf(Date);

        const lockerDb = await Locker.findById(locker._id).lean();
        expect(lockerDb.LockerStatus).toBe('available');
    });

    it('rotates LockerCode to the next combination', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        const locker = await Locker.create({
            LockerNumber: 4202,
            LockerType: 'full',
            LockerStatus: 'occupied',
            LockerCode: 'A1',
            LockerCodeCombinations: ['A1', 'A2', 'A3'],
            availableForGender: 'Female',
            buildingId: new mongoose.Types.ObjectId(),
            floorId: new mongoose.Types.ObjectId(),
        });
        await createTestAssignment({
            lockerId: locker._id,
            employeeName: 'Bob',
            employeeEmail: 'bob@example.com',
        });

        await callCancel(staff, {
            lockerNumber: 4202,
            EmployeeEmail: 'bob@example.com',
        });

        const reloaded = await Locker.findById(locker._id);
        expect(reloaded.LockerCode).toBe('A2');
    });

    it('writes a History "Allotment Cancelled" entry with the pre-cancellation cost', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff', name: 'Staff3' });
        await setupAssignedLocker({
            lockerNumber: 4203,
            employeeEmail: 'carol@example.com',
            employeeName: 'Carol',
            costToEmployee: 250,
        });

        await callCancel(staff, {
            lockerNumber: 4203,
            EmployeeEmail: 'carol@example.com',
        });

        const history = await History.findOne({ LockerNumber: 4203, comment: 'Allotment Cancelled' });
        expect(history).toBeTruthy();
        expect(history.LockerHolder).toBe('Carol');
        expect(history.Cost).toBe(250);
        expect(history.InitiatedBy).toBe('Staff3');
        expect(history.LockerStatus).toBe('Available');
    });

    it('returns 400 when holder email has no active Assignment', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        const res = await callCancel(staff, {
            lockerNumber: 4204,
            EmployeeEmail: 'nobody@example.com',
        });
        expect(res.status).toBe(400);
    });

    it('returns 400 when lockerNumber does not match', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        await setupAssignedLocker({
            lockerNumber: 4205,
            employeeEmail: 'eve@example.com',
        });

        const res = await callCancel(staff, {
            lockerNumber: 9999,
            EmployeeEmail: 'eve@example.com',
        });
        expect(res.status).toBe(400);
    });
});
