// A2.0.1 regression tests for adminControllers. Scope: the 2 endpoints
// that return Locker objects — addLocker (single) and addMultipleLocker
// (array). Both create empty Lockers with no Assignment, and both must
// continue to return the 11 SHAPE_FIELDS with default values (matches
// pre-A2.0.1 "unassigned locker" response).

const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../../../createApp.js');
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

describe('POST /api/admin/addSingleLocker — returns flattened empty Locker', () => {
    it('response body.data has all 11 SHAPE_FIELDS with default values', async () => {
        const { user: admin } = await createTestUser({ role: 'Admin' });

        const res = await request(app)
            .post('/api/admin/addSingleLocker')
            .set(createAuthHeader(admin))
            .send({
                LockerType: 'full',
                LockerNumber: 6001,
                LockerCodeCombinations: ['K1', 'K2'],
                LockerPrice3Month: 100,
                LockerPrice6Month: 180,
                LockerPrice12Month: 320,
                availableForGender: 'Male',
                LockerSerialNumber: 'S-1',
            });

        expect(res.status).toBe(201);
        for (const f of SHAPE_FIELDS) {
            expect(res.body.data).toHaveProperty(f);
        }
        expect(res.body.data.LockerNumber).toBe(6001);
        expect(res.body.data.LockerCode).toBe('K1');
        expect(res.body.data.employeeName).toBe('N/A');
        expect(res.body.data.employeeGender).toBe('None');
        expect(res.body.data.CostToEmployee).toBe(0);
        expect(res.body.data.emailSent).toBe(false);
    });
});

describe('POST /api/admin/addMultipleLocker — returns flattened empty Lockers array', () => {
    it('every element of response body.data has all 11 SHAPE_FIELDS with defaults', async () => {
        const { user: admin } = await createTestUser({ role: 'Admin' });

        const res = await request(app)
            .post('/api/admin/addMultipleLocker')
            .set(createAuthHeader(admin))
            .send([
                {
                    LockerType: 'half',
                    LockerNumber: 6101,
                    LockerCodeCombinations: ['A1', 'A2'],
                    availableForGender: 'Male',
                },
                {
                    LockerType: 'full',
                    LockerNumber: 6102,
                    LockerCodeCombinations: ['B1'],
                    availableForGender: 'Female',
                },
            ]);

        expect(res.status).toBe(201);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data).toHaveLength(2);

        for (const entry of res.body.data) {
            for (const f of SHAPE_FIELDS) {
                expect(entry).toHaveProperty(f);
            }
            expect(entry.employeeName).toBe('N/A');
            expect(entry.CostToEmployee).toBe(0);
            expect(entry.employeeGender).toBe('None');
        }
    });

    it('returns 400 when request body is not an array', async () => {
        const { user: admin } = await createTestUser({ role: 'Admin' });
        const res = await request(app)
            .post('/api/admin/addMultipleLocker')
            .set(createAuthHeader(admin))
            .send({ LockerType: 'full' });

        expect(res.status).toBe(400);
    });
});
