const mongoose = require('mongoose');
const Locker = require('../../../models/lockerModel.js');

describe('Locker model', () => {
    it('normalizes LockerType case via the setter', () => {
        const doc = new Locker({ LockerType: 'HALF' });
        expect(doc.LockerType).toBe('half');
    });

    it('defaults LockerStatus to "available"', () => {
        const doc = new Locker({ LockerNumber: 1 });
        expect(doc.LockerStatus).toBe('available');
    });

    it('normalizes availableForGender case via the setter', () => {
        const doc = new Locker({ availableForGender: 'male' });
        expect(doc.availableForGender).toBe('Male');
    });

    it('defaults zoneId to null', () => {
        const doc = new Locker({ LockerNumber: 99 });
        expect(doc.zoneId).toBeNull();
    });

    it('accepts buildingId and floorId as ObjectId refs', () => {
        const buildingId = new mongoose.Types.ObjectId();
        const floorId = new mongoose.Types.ObjectId();
        const doc = new Locker({ LockerNumber: 100, buildingId, floorId });
        expect(doc.buildingId.toString()).toBe(buildingId.toString());
        expect(doc.floorId.toString()).toBe(floorId.toString());
    });

    it('warns on save when buildingId is missing (A1-transitional)', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
            const doc = new Locker({ LockerNumber: 5001, LockerStatus: 'available' });
            await doc.save();
            const matching = spy.mock.calls.filter((call) => {
                try {
                    return JSON.parse(call[0]).event === 'locker.created_without_buildingId';
                } catch {
                    return false;
                }
            });
            expect(matching).toHaveLength(1);
            const payload = JSON.parse(matching[0][0]);
            expect(payload.lockerNumber).toBe(5001);
            expect(payload.level).toBe('warn');
        } finally {
            spy.mockRestore();
        }
    });

    it('does not warn on save when buildingId is set', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
            const doc = new Locker({
                LockerNumber: 5002,
                LockerStatus: 'available',
                buildingId: new mongoose.Types.ObjectId(),
                floorId: new mongoose.Types.ObjectId(),
            });
            await doc.save();
            const matching = spy.mock.calls.filter((call) => {
                try {
                    return JSON.parse(call[0]).event === 'locker.created_without_buildingId';
                } catch {
                    return false;
                }
            });
            expect(matching).toHaveLength(0);
        } finally {
            spy.mockRestore();
        }
    });
});
