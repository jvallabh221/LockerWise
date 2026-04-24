const mongoose = require('mongoose');

// Direct-import pattern (see a2-0-extract-assignment.test.js header).
const a201 = require(
    '../../../migrations/20260425120000-remove-locker-assignment-fields.js'
);

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

async function runUp() {
    return a201.up(
        mongoose.connection.db,
        mongoose.connection.getClient(),
    );
}

async function runDown() {
    return a201.down(
        mongoose.connection.db,
        mongoose.connection.getClient(),
    );
}

async function nukeCollections() {
    const db = mongoose.connection.db;
    for (const coll of ['lockers', 'assignments', 'buildings', 'floors', 'zones']) {
        await db.collection(coll).drop().catch(() => {});
    }
}

async function seedLockerWithStaleFields(fields = {}) {
    const doc = {
        LockerNumber: 100 + Math.floor(Math.random() * 1_000_000),
        LockerType: 'full',
        LockerStatus: 'occupied',
        LockerCode: 'C-1',
        employeeName: 'Alice',
        employeeId: 'E-1',
        employeeEmail: 'alice@example.com',
        employeePhone: '5551111',
        employeeGender: 'Female',
        CostToEmployee: 150,
        Duration: '3',
        StartDate: new Date('2026-01-01T00:00:00Z'),
        EndDate: new Date('2026-04-01T00:00:00Z'),
        expiresOn: new Date('2026-04-01T00:00:00Z'),
        emailSent: false,
        ...fields,
    };
    const res = await mongoose.connection.db.collection('lockers').insertOne(doc);
    return { _id: res.insertedId, ...doc };
}

async function seedActiveAssignment(lockerId, fields = {}) {
    const now = new Date();
    const doc = {
        lockerId,
        employeeName: 'Alice',
        employeeId: 'E-1',
        employeeEmail: 'alice@example.com',
        employeePhone: '5551111',
        employeeGender: 'Female',
        CostToEmployee: 150,
        Duration: '3',
        StartDate: new Date('2026-01-01T00:00:00Z'),
        EndDate: new Date('2026-04-01T00:00:00Z'),
        expiresOn: new Date('2026-04-01T00:00:00Z'),
        emailSent: false,
        status: 'active',
        endedAt: null,
        endedReason: null,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
        ...fields,
    };
    const res = await mongoose.connection.db.collection('assignments').insertOne(doc);
    return { _id: res.insertedId, ...doc };
}

describe('A2.0.1 migration: remove 11 fields from Locker', () => {
    beforeEach(async () => {
        await nukeCollections();
    });

    afterEach(async () => {
        await nukeCollections();
    });

    it('up $unsets the 11 fields from every Locker doc', async () => {
        const locker = await seedLockerWithStaleFields();

        await runUp();

        const reloaded = await mongoose.connection.db
            .collection('lockers')
            .findOne({ _id: locker._id });

        // All 11 fields are gone from the DB doc.
        for (const f of ASSIGNMENT_FIELDS) {
            expect(reloaded).not.toHaveProperty(f);
        }
        // Locker-config fields untouched.
        expect(reloaded.LockerNumber).toBe(locker.LockerNumber);
        expect(reloaded.LockerCode).toBe('C-1');
        expect(reloaded.LockerStatus).toBe('occupied');
    });

    it('up is idempotent (re-run = no-op)', async () => {
        const locker = await seedLockerWithStaleFields();
        await runUp();
        await runUp(); // $unset of missing fields is a no-op.

        const reloaded = await mongoose.connection.db
            .collection('lockers')
            .findOne({ _id: locker._id });
        for (const f of ASSIGNMENT_FIELDS) {
            expect(reloaded).not.toHaveProperty(f);
        }
    });

    it('down restores Locker fields from the active Assignment', async () => {
        const locker = await seedLockerWithStaleFields();
        const asgn = await seedActiveAssignment(locker._id);

        await runUp();
        await runDown();

        const reloaded = await mongoose.connection.db
            .collection('lockers')
            .findOne({ _id: locker._id });

        expect(reloaded.employeeName).toBe(asgn.employeeName);
        expect(reloaded.employeeEmail).toBe(asgn.employeeEmail);
        expect(reloaded.CostToEmployee).toBe(asgn.CostToEmployee);
        expect(reloaded.Duration).toBe(asgn.Duration);
        expect(new Date(reloaded.StartDate).toISOString()).toBe(
            asgn.StartDate.toISOString(),
        );
    });

    it('down (rollback regression): preserves post-migration Assignment modifications', async () => {
        // User addition #9: prove rollback works before we need it in prod.
        // Scenario: A2.0.1 migration ran, admins modified Assignment, now
        // rollback is needed. Down must restore the MODIFIED values, not the
        // pre-migration values.
        const locker = await seedLockerWithStaleFields({
            CostToEmployee: 100, // stale copy at time of up
        });
        const asgn = await seedActiveAssignment(locker._id, {
            CostToEmployee: 100, // matches stale at time of up
        });

        await runUp();

        // Admin modifies the Assignment post-migration.
        await mongoose.connection.db
            .collection('assignments')
            .updateOne(
                { _id: asgn._id },
                {
                    $set: {
                        CostToEmployee: 175,
                        employeeName: 'Alice (corrected)',
                        updatedAt: new Date(Date.now() + 60_000),
                    },
                },
            );

        await runDown();

        const reloaded = await mongoose.connection.db
            .collection('lockers')
            .findOne({ _id: locker._id });

        // Rollback picked up the modified values, not the stale 100.
        expect(reloaded.CostToEmployee).toBe(175);
        expect(reloaded.employeeName).toBe('Alice (corrected)');
    });

    it('down applies defaults to Lockers with no active Assignment', async () => {
        // An unassigned locker at time of up. After down, pre-A2.0.1 code
        // expects to read 'N/A' / '' / 0 / false defaults on Locker — not
        // undefined.
        const locker = await seedLockerWithStaleFields({
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
        });

        await runUp();
        await runDown();

        const reloaded = await mongoose.connection.db
            .collection('lockers')
            .findOne({ _id: locker._id });
        expect(reloaded.employeeName).toBe('N/A');
        expect(reloaded.employeeGender).toBe('None');
        expect(reloaded.CostToEmployee).toBe(0);
        expect(reloaded.emailSent).toBe(false);
        expect(reloaded.StartDate).toBe('');
    });

    it('down aborts if a Locker already has any of the 11 fields set', async () => {
        // Post-up state should have no fields on Locker. If a manual write
        // added them back between up and down, abort rather than overwrite.
        const locker = await seedLockerWithStaleFields();
        await runUp();

        // Simulate manual post-migration write.
        await mongoose.connection.db.collection('lockers').updateOne(
            { _id: locker._id },
            { $set: { employeeName: 'Manual' } },
        );

        await expect(runDown()).rejects.toThrow(
            /one or more of the 11 assignment fields set/i,
        );
    });

    it('down aborts if any Locker has more than one active Assignment', async () => {
        // Defense against partial unique index corruption.
        const locker = await seedLockerWithStaleFields();
        await seedActiveAssignment(locker._id);
        await runUp();

        // Bypass the unique index via direct insert. dropIndex is tolerant:
        // Mongoose auto-index creation is async and may or may not have
        // fired by the time this test runs.
        await mongoose.connection.db
            .collection('assignments')
            .dropIndex('lockerId_1_active_unique')
            .catch(() => {});
        await seedActiveAssignment(locker._id, {
            employeeName: 'Duplicate',
            employeeEmail: 'dup@example.com',
        });

        await expect(runDown()).rejects.toThrow(
            /more than one active Assignment/i,
        );
    });
});
