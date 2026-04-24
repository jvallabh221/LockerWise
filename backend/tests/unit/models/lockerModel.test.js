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
});
