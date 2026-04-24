const mongoose = require('mongoose');
const Assignment = require('../../../models/assignmentModel.js');

describe('Assignment model', () => {
    it('requires lockerId', async () => {
        const doc = new Assignment({});
        const err = await doc.validate().catch((e) => e);
        expect(err).toBeTruthy();
        expect(err.errors.lockerId).toBeTruthy();
    });

    it('defaults status to "active"', () => {
        const doc = new Assignment({
            lockerId: new mongoose.Types.ObjectId(),
        });
        expect(doc.status).toBe('active');
    });

    it('accepts status values "active", "ended", "reserved"', () => {
        const lockerId = new mongoose.Types.ObjectId();
        for (const s of ['active', 'ended', 'reserved']) {
            const doc = new Assignment({ lockerId, status: s });
            expect(doc.status).toBe(s);
        }
    });

    it('rejects an invalid status', async () => {
        const doc = new Assignment({
            lockerId: new mongoose.Types.ObjectId(),
            status: 'foo',
        });
        const err = await doc.validate().catch((e) => e);
        expect(err).toBeTruthy();
        expect(err.errors.status).toBeTruthy();
    });

    it('defaults endedAt and endedReason to null', () => {
        const doc = new Assignment({
            lockerId: new mongoose.Types.ObjectId(),
        });
        expect(doc.endedAt).toBeNull();
        expect(doc.endedReason).toBeNull();
    });

    it('accepts endedReason of null, "returned", "cancelled", "expired"', () => {
        const lockerId = new mongoose.Types.ObjectId();
        for (const r of [null, 'returned', 'cancelled', 'expired']) {
            const doc = new Assignment({ lockerId, endedReason: r });
            expect(doc.endedReason).toBe(r);
        }
    });

    it('rejects an invalid endedReason', async () => {
        const doc = new Assignment({
            lockerId: new mongoose.Types.ObjectId(),
            endedReason: 'foo',
        });
        const err = await doc.validate().catch((e) => e);
        expect(err).toBeTruthy();
        expect(err.errors.endedReason).toBeTruthy();
    });

    it('defaults emailSent to false', () => {
        const doc = new Assignment({
            lockerId: new mongoose.Types.ObjectId(),
        });
        expect(doc.emailSent).toBe(false);
    });

    it('defaults CostToEmployee to 0 and employeeName to "N/A"', () => {
        const doc = new Assignment({
            lockerId: new mongoose.Types.ObjectId(),
        });
        expect(doc.CostToEmployee).toBe(0);
        expect(doc.employeeName).toBe('N/A');
    });

    it('defaults deletedAt to null', () => {
        const doc = new Assignment({
            lockerId: new mongoose.Types.ObjectId(),
        });
        expect(doc.deletedAt).toBeNull();
    });
});
