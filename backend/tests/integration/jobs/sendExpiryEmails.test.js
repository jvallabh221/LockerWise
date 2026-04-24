const mongoose = require('mongoose');
const sendExpiryEmails = require('../../../jobs/sendExpiryEmails.js');
const Assignment = require('../../../models/assignmentModel.js');
const {
    createTestLocker,
    createTestAssignment,
} = require('../../helpers/fixtures.js');

// A fixed "now" at noon UTC so the start-of-day / end-of-day math is clean.
const NOW = new Date('2026-04-24T12:00:00.000Z');

describe('sendExpiryEmails', () => {
    it('sends email for an active Assignment expiring today and flips emailSent', async () => {
        const locker = await createTestLocker();
        const asgn = await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-24T18:00:00.000Z'),
            emailSent: false,
            employeeEmail: 'holder@example.com',
        });

        const mailer = vi.fn().mockResolvedValue(undefined);
        const result = await sendExpiryEmails({ now: NOW, mailer });

        expect(mailer).toHaveBeenCalledTimes(1);
        expect(mailer).toHaveBeenCalledWith(
            'holder@example.com',
            'Locker Expiration Notification',
            expect.any(String),
        );

        const reloaded = await Assignment.findById(asgn._id);
        expect(reloaded.emailSent).toBe(true);
        expect(result.sent).toBe(1);
    });

    it('does not email when the Assignment already has emailSent=true', async () => {
        const locker = await createTestLocker();
        await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-24T18:00:00.000Z'),
            emailSent: true,
        });

        const mailer = vi.fn().mockResolvedValue(undefined);
        const result = await sendExpiryEmails({ now: NOW, mailer });

        expect(mailer).not.toHaveBeenCalled();
        expect(result.sent).toBe(0);
    });

    it('does not email when the Assignment expires tomorrow', async () => {
        const locker = await createTestLocker();
        await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-25T12:00:00.000Z'),
            emailSent: false,
        });

        const mailer = vi.fn().mockResolvedValue(undefined);
        const result = await sendExpiryEmails({ now: NOW, mailer });

        expect(mailer).not.toHaveBeenCalled();
        expect(result.considered).toBe(0);
    });

    it('does not email an ended Assignment even if expiresOn is today', async () => {
        const locker = await createTestLocker();
        await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-24T18:00:00.000Z'),
            emailSent: false,
            status: 'ended',
        });

        const mailer = vi.fn().mockResolvedValue(undefined);
        const result = await sendExpiryEmails({ now: NOW, mailer });

        expect(mailer).not.toHaveBeenCalled();
        expect(result.considered).toBe(0);
    });

    it('skips an Assignment with no employeeEmail without crashing', async () => {
        const locker = await createTestLocker();
        const asgn = await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-24T18:00:00.000Z'),
            emailSent: false,
            employeeEmail: null,
        });
        // Mongoose treats explicit null as null; manually strip to match
        // a real "field never set" state too.
        await Assignment.updateOne(
            { _id: asgn._id },
            { $unset: { employeeEmail: '' } },
        );

        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const mailer = vi.fn().mockResolvedValue(undefined);
        try {
            const result = await sendExpiryEmails({ now: NOW, mailer });
            expect(mailer).not.toHaveBeenCalled();
            expect(result.sent).toBe(0);
            expect(warnSpy).toHaveBeenCalled();
        } finally {
            warnSpy.mockRestore();
        }

        const reloaded = await Assignment.findById(asgn._id);
        expect(reloaded.emailSent).toBe(false);
    });

    it('leaves emailSent unchanged when the mailer throws', async () => {
        const locker = await createTestLocker();
        const asgn = await createTestAssignment({
            lockerId: locker._id,
            expiresOn: new Date('2026-04-24T18:00:00.000Z'),
            emailSent: false,
            employeeEmail: 'holder@example.com',
        });

        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const mailer = vi.fn().mockRejectedValue(new Error('smtp down'));
        try {
            await sendExpiryEmails({ now: NOW, mailer });
        } finally {
            errSpy.mockRestore();
        }

        const reloaded = await Assignment.findById(asgn._id);
        expect(reloaded.emailSent).toBe(false);
    });
});
