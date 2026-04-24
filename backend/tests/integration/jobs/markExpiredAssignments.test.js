const mongoose = require('mongoose');
const markExpiredAssignments = require('../../../jobs/markExpiredAssignments.js');
const Assignment = require('../../../models/assignmentModel.js');
const Locker = require('../../../models/lockerModel.js');
const {
    createTestLocker,
    createTestAssignment,
} = require('../../helpers/fixtures.js');

const NOW = new Date('2026-04-24T12:00:00.000Z');

describe('markExpiredAssignments', () => {
    it('ends an active Assignment whose expiresOn is in the past and marks the Locker expired', async () => {
        const locker = await createTestLocker({ status: 'occupied' });
        const asgn = await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-23T00:00:00.000Z'),
            status: 'active',
        });

        const result = await markExpiredAssignments({ now: NOW });

        expect(result.marked).toBe(1);

        const reloadedAsgn = await Assignment.findById(asgn._id);
        expect(reloadedAsgn.status).toBe('ended');
        expect(reloadedAsgn.endedReason).toBe('expired');
        expect(reloadedAsgn.endedAt.toISOString()).toBe(NOW.toISOString());

        const reloadedLocker = await Locker.findById(locker._id);
        expect(reloadedLocker.LockerStatus).toBe('expired');
    });

    it('does not touch an Assignment whose expiresOn is in the future', async () => {
        const locker = await createTestLocker({ status: 'occupied' });
        const asgn = await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-30T12:00:00.000Z'),
            status: 'active',
        });

        const result = await markExpiredAssignments({ now: NOW });

        expect(result.marked).toBe(0);

        const reloaded = await Assignment.findById(asgn._id);
        expect(reloaded.status).toBe('active');
        const reloadedLocker = await Locker.findById(locker._id);
        expect(reloadedLocker.LockerStatus).toBe('occupied');
    });

    it('does not touch an already-ended Assignment even if expiresOn is in the past', async () => {
        const locker = await createTestLocker({ status: 'expired' });
        const asgn = await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-01T00:00:00.000Z'),
            status: 'ended',
        });

        // Manually set endedAt/endedReason so the fixture doc is well-formed.
        await Assignment.updateOne(
            { _id: asgn._id },
            {
                $set: {
                    endedAt: new Date('2026-04-02T00:00:00.000Z'),
                    endedReason: 'returned',
                },
            },
        );

        const result = await markExpiredAssignments({ now: NOW });

        expect(result.marked).toBe(0);

        const reloaded = await Assignment.findById(asgn._id);
        expect(reloaded.endedReason).toBe('returned');
    });

    it('is a no-op when no assignments are expiring', async () => {
        const result = await markExpiredAssignments({ now: NOW });
        expect(result.considered).toBe(0);
        expect(result.marked).toBe(0);
    });

    it('leaves the Locker untouched when its LockerStatus is already "expired"', async () => {
        const locker = await createTestLocker({ status: 'expired' });
        const asgn = await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-20T00:00:00.000Z'),
            status: 'active',
        });

        await markExpiredAssignments({ now: NOW });

        const reloaded = await Assignment.findById(asgn._id);
        expect(reloaded.status).toBe('ended');
        const reloadedLocker = await Locker.findById(locker._id);
        expect(reloadedLocker.LockerStatus).toBe('expired');
    });
});
