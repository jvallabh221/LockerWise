// Cross-endpoint smoke test (user's addition #7). Exercises the full
// allocation-to-status-change lifecycle in one flow, asserting response
// shape at each step. Catches inter-endpoint regressions the per-endpoint
// tests miss.

const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../../../createApp.js');
const Locker = require('../../../models/lockerModel.js');
const Assignment = require('../../../models/assignmentModel.js');
const Building = require('../../../models/buildingModel.js');
const Floor = require('../../../models/floorModel.js');
const {
    createTestUser,
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

const SHAPE_FIELDS = [
    'employeeName', 'employeeId', 'employeeEmail', 'employeePhone',
    'employeeGender', 'CostToEmployee', 'Duration', 'StartDate',
    'EndDate', 'expiresOn', 'emailSent',
];

describe('Locker assignment lifecycle — cross-endpoint smoke', () => {
    it('allocate → renew → editLockerDetails → cancel → changeLockerStatus preserves shape', async () => {
        // Stage 0: setup — Building, Floor, empty Locker, Staff + Admin users.
        const building = await Building.create({
            name: 'Smoke Test Building',
            timezone: 'UTC',
        });
        const floor = await Floor.create({
            buildingId: building._id,
            name: 'Smoke Test Floor',
        });
        await Locker.create({
            LockerNumber: 7001,
            LockerType: 'full',
            LockerStatus: 'available',
            LockerCode: 'SM-1',
            LockerCodeCombinations: ['SM-1', 'SM-2', 'SM-3'],
            availableForGender: 'Female',
            buildingId: building._id,
            floorId: floor._id,
        });
        const { user: staff } = await createTestUser({ role: 'Staff', name: 'SmokeStaff' });
        const { user: admin } = await createTestUser({ role: 'Admin', name: 'SmokeAdmin' });

        // Stage 1: allocate.
        const alloc = await request(app)
            .post('/api/locker/allocateLocker')
            .set(createAuthHeader(staff))
            .send({
                lockerNumber: 7001,
                lockerType: 'full',
                lockerCode: 'SM-1',
                employeeName: 'Smoke User',
                employeeId: 'SMK-1',
                employeeEmail: 'smoke@example.com',
                employeePhone: '5550007',
                employeeGender: 'Female',
                costToEmployee: 150,
                duration: '3',
                startDate: '2026-04-24',
                endDate: '2026-07-24',
            });
        expect(alloc.status).toBe(200);
        for (const f of SHAPE_FIELDS) expect(alloc.body.data).toHaveProperty(f);
        expect(alloc.body.data.employeeName).toBe('Smoke User');
        expect(alloc.body.data.CostToEmployee).toBe(150);

        // Stage 2: renew — bump cost and duration.
        const renew = await request(app)
            .put('/api/locker/renewLocker')
            .set(createAuthHeader(staff))
            .send({
                lockerNumber: 7001,
                EmployeeEmail: 'smoke@example.com',
                costToEmployee: 225,
                duration: '6',
                startDate: '2026-04-24',
                endDate: '2026-10-24',
            });
        expect(renew.status).toBe(200);
        for (const f of SHAPE_FIELDS) expect(renew.body.data).toHaveProperty(f);
        expect(renew.body.data.employeeName).toBe('Smoke User');   // preserved
        expect(renew.body.data.CostToEmployee).toBe(225);          // renewed
        expect(renew.body.data.Duration).toBe('6');
        expect(renew.body.data.emailSent).toBe(false);             // reset by renew

        // Stage 3: editLockerDetails — change the locker code (config field)
        // and the employeePhone (assignment field) in one call.
        const edit = await request(app)
            .put('/api/locker/editLockerDetails')
            .set(createAuthHeader(admin))
            .send({
                LockerDetails: {
                    LockerNumber: 7001,
                    LockerCode: 'SM-2',
                    employeePhone: '5559999',
                },
            });
        expect(edit.status).toBe(200);

        // Verify via DB: Locker.LockerCode updated; Assignment.employeePhone updated.
        const l = await Locker.findOne({ LockerNumber: 7001 }).lean();
        expect(l.LockerCode).toBe('SM-2');
        const asgn = await Assignment.findOne({ lockerId: l._id, status: 'active' });
        expect(asgn.employeePhone).toBe('5559999');

        // Stage 4: cancel.
        const cancel = await request(app)
            .post('/api/locker/cancelLocker')
            .set(createAuthHeader(staff))
            .send({
                lockerNumber: 7001,
                EmployeeEmail: 'smoke@example.com',
            });
        expect(cancel.status).toBe(200);
        // Shape preserved; values are now defaults (unassigned).
        for (const f of SHAPE_FIELDS) expect(cancel.body.data).toHaveProperty(f);
        expect(cancel.body.data.employeeName).toBe('N/A');
        expect(cancel.body.data.CostToEmployee).toBe(0);
        expect(cancel.body.data.Duration).toBe('');
        expect(cancel.body.data.emailSent).toBe(false);

        // Verify Assignment is ended, Locker is available.
        const asgnEnded = await Assignment.findById(asgn._id);
        expect(asgnEnded.status).toBe('ended');
        expect(asgnEnded.endedReason).toBe('cancelled');
        const lockerAfterCancel = await Locker.findById(l._id).lean();
        expect(lockerAfterCancel.LockerStatus).toBe('available');

        // Stage 5: changeLockerStatus (admin flips to 'expired' for whatever
        // reason). History entry's LockerHolder should read defaults — the
        // Assignment is ended, the just-ended values don't bleed into this
        // History write (user's addition #3 edge case).
        const status = await request(app)
            .put('/api/locker/changeLockerStatus')
            .set(createAuthHeader(admin))
            .send({
                LockerNumber: 7001,
                LockerStatus: 'expired',
            });
        expect(status.status).toBe(200);

        const History = require('../../../models/History.js');
        const historyEntries = await History.find({
            LockerNumber: 7001,
            comment: 'Locker Status Changed',
        });
        expect(historyEntries).toHaveLength(1);
        expect(historyEntries[0].LockerHolder).toBe('N/A');  // default, not 'Smoke User'
        expect(historyEntries[0].Cost).toBe(0);              // default, not 225
    });
});
