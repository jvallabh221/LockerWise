const Building = require('../../../models/buildingModel.js');

describe('Building model', () => {
    it('requires name', async () => {
        const doc = new Building({});
        const err = await doc.validate().catch((e) => e);
        expect(err).toBeTruthy();
        expect(err.errors.name).toBeTruthy();
    });

    it('defaults timezone to "UTC"', () => {
        const doc = new Building({ name: 'HQ' });
        expect(doc.timezone).toBe('UTC');
    });

    it('accepts an optional address', () => {
        const doc = new Building({ name: 'HQ', address: '1 Main St' });
        expect(doc.address).toBe('1 Main St');
    });

    it('defaults address to null', () => {
        const doc = new Building({ name: 'HQ' });
        expect(doc.address).toBeNull();
    });

    it('defaults deletedAt to null', () => {
        const doc = new Building({ name: 'HQ' });
        expect(doc.deletedAt).toBeNull();
    });
});
