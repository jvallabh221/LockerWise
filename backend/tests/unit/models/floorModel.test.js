const mongoose = require('mongoose');
const Floor = require('../../../models/floorModel.js');

describe('Floor model', () => {
    it('requires buildingId and name', async () => {
        const doc = new Floor({});
        const err = await doc.validate().catch((e) => e);
        expect(err).toBeTruthy();
        expect(err.errors.buildingId).toBeTruthy();
        expect(err.errors.name).toBeTruthy();
    });

    it('accepts an optional wing', () => {
        const doc = new Floor({
            buildingId: new mongoose.Types.ObjectId(),
            name: 'Floor 2',
            wing: 'North',
        });
        expect(doc.wing).toBe('North');
    });

    it('defaults wing to null when absent', () => {
        const doc = new Floor({
            buildingId: new mongoose.Types.ObjectId(),
            name: 'Floor 1',
        });
        expect(doc.wing).toBeNull();
    });

    it('defaults deletedAt to null', () => {
        const doc = new Floor({
            buildingId: new mongoose.Types.ObjectId(),
            name: 'Floor 1',
        });
        expect(doc.deletedAt).toBeNull();
    });
});
