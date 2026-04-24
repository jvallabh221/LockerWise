const mongoose = require('mongoose');
const Zone = require('../../../models/zoneModel.js');

describe('Zone model', () => {
    it('requires floorId and name', async () => {
        const doc = new Zone({});
        const err = await doc.validate().catch((e) => e);
        expect(err).toBeTruthy();
        expect(err.errors.floorId).toBeTruthy();
        expect(err.errors.name).toBeTruthy();
    });

    it('accepts floorId and name', () => {
        const floorId = new mongoose.Types.ObjectId();
        const doc = new Zone({ floorId, name: 'Section A' });
        expect(doc.floorId.toString()).toBe(floorId.toString());
        expect(doc.name).toBe('Section A');
    });

    it('defaults deletedAt to null', () => {
        const doc = new Zone({
            floorId: new mongoose.Types.ObjectId(),
            name: 'Section A',
        });
        expect(doc.deletedAt).toBeNull();
    });
});
