// A2.0.1 regression tests for issueController. Scope: the 4 endpoints that
// write History entries sourced from the now-extracted assignment fields
// (employeeName, CostToEmployee). Each test seeds a Locker + active
// Assignment, hits the endpoint, and asserts the History entry has the
// correct LockerHolder and Cost from the Assignment, not stale Locker data.
//
// Other issue endpoints (raiseTechnicalIssue, updateComment, getAllIssues)
// don't touch the 11 fields and stay out of scope per the inventory.

const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../../../createApp.js');
const Issue = require('../../../models/Issue.js');
const History = require('../../../models/History.js');
const {
    createTestUser,
    createTestLocker,
    createTestAssignment,
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

async function setupAssignedLocker({ lockerNumber, employeeName, costToEmployee, employeeEmail }) {
    const locker = await createTestLocker({ lockerNumber, status: 'occupied' });
    const asgn = await createTestAssignment({
        lockerId: locker._id,
        employeeName,
        employeeEmail,
        costToEmployee,
    });
    return { locker, asgn };
}

describe('POST /api/issue/raiseLockerIssue — History.LockerHolder from Assignment', () => {
    it('writes "Issue Raised" History with holder + cost from active Assignment', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff', name: 'StaffIssue1' });
        const { locker } = await setupAssignedLocker({
            lockerNumber: 5001,
            employeeName: 'Holder-R',
            employeeEmail: 'holder-r@example.com',
            costToEmployee: 120,
        });

        const res = await request(app)
            .post('/api/issue/raiseLockerIssue')
            .set(createAuthHeader(staff))
            .send({
                subject: 'Key stuck',
                description: 'Cannot insert key',
                LockerNumber: 5001,
                email: 'holder-r@example.com',
            });

        expect(res.status).toBe(201);
        const history = await History.findOne({ LockerNumber: 5001, comment: 'Issue Raised' });
        expect(history).toBeTruthy();
        expect(history.LockerHolder).toBe('Holder-R');
        expect(history.Cost).toBe(120);
    });

    it('writes History with defaults when the locker has no active Assignment', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff' });
        await createTestLocker({ lockerNumber: 5002, status: 'available' });

        const res = await request(app)
            .post('/api/issue/raiseLockerIssue')
            .set(createAuthHeader(staff))
            .send({
                subject: 'Issue',
                description: 'Desc',
                LockerNumber: 5002,
                email: 'external@example.com',
            });

        expect(res.status).toBe(201);
        const history = await History.findOne({ LockerNumber: 5002, comment: 'Issue Raised' });
        expect(history.LockerHolder).toBe('N/A');
        expect(history.Cost).toBe(0);
    });
});

describe('PUT /api/issue/updateIssue — History.LockerHolder from Assignment', () => {
    it('writes "Issue Processed" History with holder from active Assignment', async () => {
        const { user: admin } = await createTestUser({ role: 'Admin' });
        const { locker } = await setupAssignedLocker({
            lockerNumber: 5101,
            employeeName: 'Holder-U',
            employeeEmail: 'holder-u@example.com',
            costToEmployee: 160,
        });

        // Seed an issue so updateIssue has something to update.
        const issue = await Issue.create({
            subject: 'Q',
            description: 'D',
            type: 'locker',
            LockerNumber: 5101,
            email: 'holder-u@example.com',
        });

        const res = await request(app)
            .put('/api/issue/updateIssue')
            .set(createAuthHeader(admin))
            .send({ id: issue._id.toString(), status: 'In Action' });

        expect(res.status).toBe(200);
        const history = await History.findOne({ LockerNumber: 5101, comment: 'Issue Processed' });
        expect(history).toBeTruthy();
        expect(history.LockerHolder).toBe('Holder-U');
        expect(history.Cost).toBe(160);
    });
});

describe('PUT /api/issue/resolveIssue — History.LockerHolder from Assignment', () => {
    it('writes "Issue Resolved" History with holder from active Assignment', async () => {
        const { user: admin } = await createTestUser({ role: 'Admin' });
        const { locker } = await setupAssignedLocker({
            lockerNumber: 5201,
            employeeName: 'Holder-Res',
            employeeEmail: 'holder-res@example.com',
            costToEmployee: 210,
        });

        const issue = await Issue.create({
            subject: 'Q',
            description: 'D',
            type: 'locker',
            LockerNumber: 5201,
            email: 'holder-res@example.com',
        });

        const res = await request(app)
            .put('/api/issue/resolveIssue')
            .set(createAuthHeader(admin))
            .send({ id: issue._id.toString() });

        expect(res.status).toBe(200);
        const history = await History.findOne({ LockerNumber: 5201, comment: 'Issue Resolved' });
        expect(history).toBeTruthy();
        expect(history.LockerHolder).toBe('Holder-Res');
        expect(history.Cost).toBe(210);
    });
});

describe('POST /api/issue/deleteIssue — History.LockerHolder from Assignment', () => {
    it('writes "Issue Deleted" History with holder from active Assignment', async () => {
        const { user: staff } = await createTestUser({ role: 'Staff', name: 'StaffIssueD' });
        const { locker } = await setupAssignedLocker({
            lockerNumber: 5301,
            employeeName: 'Holder-D',
            employeeEmail: 'holder-d@example.com',
            costToEmployee: 90,
        });

        const issue = await Issue.create({
            subject: 'Q',
            description: 'D',
            type: 'locker',
            LockerNumber: 5301,
            email: 'holder-d@example.com',
        });

        const res = await request(app)
            .post('/api/issue/deleteIssue')
            .set(createAuthHeader(staff))
            .send({ id: issue._id.toString() });

        expect(res.status).toBe(200);
        const history = await History.findOne({ LockerNumber: 5301, comment: 'Issue Deleted' });
        expect(history).toBeTruthy();
        expect(history.LockerHolder).toBe('Holder-D');
        expect(history.Cost).toBe(90);
    });
});
