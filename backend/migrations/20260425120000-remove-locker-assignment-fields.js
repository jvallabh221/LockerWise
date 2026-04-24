// A2.0.1 — Remove the 11 assignment-related fields from every Locker doc.
// After A2.0 copied them to Assignment and A2.0.1 rewrote every controller
// to read/write via Assignment, the Locker copies are stale. This migration
// drops them.
//
// The schema change (removing the fields from lockerSchema) ships in the
// same commit as this migration; together they fully eliminate the 11
// fields from the Locker model / collection.
//
// ROLLBACK (order matters): migrate-mongo down FIRST, then code revert.
// Down copies the 11 fields from the ACTIVE Assignment back to the
// corresponding Locker, so the pre-A2.0.1 code (which reads Locker fields)
// finds data to read once redeployed.

const ASSIGNMENT_FIELDS = [
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

const UNASSIGNED_DEFAULTS = {
    employeeName: 'N/A',
    employeeId: '',
    employeeEmail: '',
    employeePhone: '',
    employeeGender: 'None',
    CostToEmployee: 0,
    Duration: '',
    StartDate: '',
    EndDate: '',
    expiresOn: '',
    emailSent: false,
};

module.exports = {
    async up(db, client) {
        // $unset on every Locker. $unset of a missing field is a no-op,
        // so re-running up is idempotent.
        const unsetSpec = {};
        for (const f of ASSIGNMENT_FIELDS) unsetSpec[f] = '';
        await db.collection('lockers').updateMany({}, { $unset: unsetSpec });
    },

    async down(db, client) {
        // Abort 1: any Locker doc already has ANY of the 11 fields set.
        // Shouldn't happen (schema dropped them) but defensive.
        const anyField = {};
        for (const f of ASSIGNMENT_FIELDS) anyField[f] = { $exists: true };
        const lockersWithStaleFields = await db.collection('lockers').countDocuments({
            $or: ASSIGNMENT_FIELDS.map((f) => ({ [f]: { $exists: true } })),
        });
        if (lockersWithStaleFields > 0) {
            throw new Error(
                `Refusing to reverse A2.0.1: ${lockersWithStaleFields} locker(s) already ` +
                    `have one or more of the 11 assignment fields set. The schema removed ` +
                    `them, so their presence means manual DB writes happened. Investigate ` +
                    `before running down.`,
            );
        }

        // Abort 2: any Locker has MORE than one active Assignment.
        // The partial unique index prevents this; defense against index
        // corruption / manual writes.
        const multi = await db
            .collection('assignments')
            .aggregate([
                { $match: { status: 'active', deletedAt: null } },
                { $group: { _id: '$lockerId', count: { $sum: 1 } } },
                { $match: { count: { $gt: 1 } } },
                { $count: 'overloaded' },
            ])
            .toArray();
        const overloadedCount = multi[0] ? multi[0].overloaded : 0;
        if (overloadedCount > 0) {
            throw new Error(
                `Refusing to reverse A2.0.1: ${overloadedCount} locker(s) have more than one ` +
                    `active Assignment. Down cannot pick which one to copy back. Investigate.`,
            );
        }

        // For each active Assignment, copy its 11 fields back to the Locker.
        const active = await db
            .collection('assignments')
            .find({ status: 'active', deletedAt: null })
            .toArray();
        for (const asgn of active) {
            const setSpec = {};
            for (const f of ASSIGNMENT_FIELDS) {
                const v = asgn[f];
                setSpec[f] = v === undefined || v === null ? UNASSIGNED_DEFAULTS[f] : v;
            }
            await db.collection('lockers').updateOne({ _id: asgn.lockerId }, { $set: setSpec });
        }

        // For every Locker that does NOT have an active Assignment, set
        // defaults so pre-A2.0.1 code (which reads these fields) sees the
        // expected "unassigned" shape.
        const activeLockerIds = active.map((a) => a.lockerId);
        await db
            .collection('lockers')
            .updateMany(
                { _id: { $nin: activeLockerIds } },
                { $set: UNASSIGNED_DEFAULTS },
            );
    },
};
