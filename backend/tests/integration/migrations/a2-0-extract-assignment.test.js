const mongoose = require('mongoose');
const Locker = require('../../../models/lockerModel.js');
const Assignment = require('../../../models/assignmentModel.js');

// === Migration test pattern (Phase 1 standing convention) ===
//
// Every migration integration test in this folder imports the migration
// module directly rather than driving migrate-mongo's CLI API. Reasons:
//
//  - migrate-mongo.up() applies every pending migration in the folder, so
//    tests for migration N would also run migrations N+1, N+2, ... once
//    those land. Down only rolls back the most-recent, so migration N's
//    own down branches never execute in a test context.
//  - Direct import isolates each test to exactly one migration's up/down
//    (matched pair), independent of siblings.
//  - No changelog management needed; tests don't touch migrate-mongo's
//    bookkeeping.
//
// `npm run verify:migrations` drives the full migrate-mongo API end-to-end
// against memory-server — that's where we prove the folder as a whole
// round-trips. These integration tests are unit-style checks on one
// migration's function pair.
const a20 = require(
    '../../../migrations/20260425000000-extract-assignment-collection.js'
);

async function runUp() {
    return a20.up(mongoose.connection.db, mongoose.connection.getClient());
}

async function runDown() {
    return a20.down(mongoose.connection.db, mongoose.connection.getClient());
}

async function seedLockerRaw(fields = {}) {
    const doc = {
        LockerNumber: 100 + Math.floor(Math.random() * 1_000_000),
        LockerStatus: 'occupied',
        employeeName: 'Alice',
        employeeId: 'EMP-1',
        employeeEmail: 'alice@example.com',
        employeePhone: '5550001',
        employeeGender: 'Female',
        CostToEmployee: 150,
        Duration: '3',
        StartDate: new Date('2026-01-01T00:00:00Z'),
        EndDate: new Date('2026-04-01T00:00:00Z'),
        expiresOn: new Date('2026-04-01T00:00:00Z'),
        emailSent: false,
        ...fields,
    };
    const res = await mongoose.connection.db
        .collection('lockers')
        .insertOne(doc);
    return { _id: res.insertedId, ...doc };
}

async function nukeCollections() {
    const db = mongoose.connection.db;
    for (const coll of [
        'lockers',
        'assignments',
        'buildings',
        'floors',
        'zones',
        'migrations_changelog',
        'migrations_changelog_lock',
    ]) {
        await db.collection(coll).drop().catch(() => {});
    }
}

describe('A2.0 migration: extract Assignment collection', () => {
    beforeEach(async () => {
        await nukeCollections();
    });

    afterEach(async () => {
        await nukeCollections();
    });

    it('up copies all 11 fields from a currently-assigned Locker into an Assignment', async () => {
        const locker = await seedLockerRaw();
        await runUp();

        const assignments = await mongoose.connection.db
            .collection('assignments')
            .find()
            .toArray();
        expect(assignments).toHaveLength(1);
        const asgn = assignments[0];

        expect(asgn.lockerId.toString()).toBe(locker._id.toString());
        expect(asgn.status).toBe('active');
        expect(asgn.employeeName).toBe(locker.employeeName);
        expect(asgn.employeeId).toBe(locker.employeeId);
        expect(asgn.employeeEmail).toBe(locker.employeeEmail);
        expect(asgn.employeePhone).toBe(locker.employeePhone);
        expect(asgn.employeeGender).toBe(locker.employeeGender);
        expect(asgn.CostToEmployee).toBe(locker.CostToEmployee);
        expect(asgn.Duration).toBe(locker.Duration);
        expect(asgn.StartDate.toISOString()).toBe(
            locker.StartDate.toISOString(),
        );
        expect(asgn.EndDate.toISOString()).toBe(
            locker.EndDate.toISOString(),
        );
        expect(asgn.expiresOn.toISOString()).toBe(
            locker.expiresOn.toISOString(),
        );
        expect(asgn.emailSent).toBe(locker.emailSent);
        expect(asgn.endedAt).toBeNull();
        expect(asgn.endedReason).toBeNull();
        expect(asgn.deletedAt).toBeNull();
    });

    it('up does not modify the Locker document', async () => {
        const seeded = await seedLockerRaw();
        await runUp();

        const locker = await mongoose.connection.db
            .collection('lockers')
            .findOne({ _id: seeded._id });
        expect(locker.employeeName).toBe(seeded.employeeName);
        expect(locker.StartDate.toISOString()).toBe(
            seeded.StartDate.toISOString(),
        );
        expect(locker.emailSent).toBe(seeded.emailSent);
    });

    it('up skips Lockers with employeeName "N/A"', async () => {
        await seedLockerRaw({ employeeName: 'N/A' });
        await runUp();

        expect(
            await mongoose.connection.db
                .collection('assignments')
                .countDocuments(),
        ).toBe(0);
    });

    it('up skips Lockers without StartDate (legacy/partial state)', async () => {
        await seedLockerRaw({ StartDate: null, employeeName: 'Bob' });
        await runUp();

        expect(
            await mongoose.connection.db
                .collection('assignments')
                .countDocuments(),
        ).toBe(0);
    });

    it('up is idempotent at the function level (re-run as no-op)', async () => {
        await seedLockerRaw();
        await runUp();
        // Re-run up directly. The upsert keyed on { lockerId, status: 'active' }
        // makes this a no-op; no duplicate Assignment is created.
        await runUp();

        expect(
            await mongoose.connection.db
                .collection('assignments')
                .countDocuments(),
        ).toBe(1);
    });

    it('partial unique index rejects a second active Assignment for the same Locker', async () => {
        const locker = await seedLockerRaw();
        await runUp();

        await expect(
            mongoose.connection.db.collection('assignments').insertOne({
                lockerId: locker._id,
                employeeName: 'Carol',
                status: 'active',
                endedAt: null,
                endedReason: null,
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        ).rejects.toThrow(/duplicate key/i);
    });

    // Tests for the `currentAssignment` virtual are intentionally removed:
    // the virtual is gone in A2.0.1's final commit once every consumer
    // migrated to explicit Assignment queries via flattenLockerResponse.js.
    // Keeping tests for a removed feature would fail on every run.

    it('down reverses cleanly when nothing was modified', async () => {
        await seedLockerRaw();
        await runUp();
        await runDown();

        expect(
            await mongoose.connection.db
                .collection('assignments')
                .countDocuments(),
        ).toBe(0);

        const indexes = await mongoose.connection.db
            .collection('assignments')
            .indexes()
            .catch(() => []);
        const nonIdIndexes = indexes.filter((i) => i.name !== '_id_');
        expect(nonIdIndexes).toHaveLength(0);
    });

    it('down aborts when any Assignment has status "ended"', async () => {
        const seeded = await seedLockerRaw();
        await runUp();

        await mongoose.connection.db.collection('assignments').updateOne(
            { lockerId: seeded._id },
            {
                $set: {
                    status: 'ended',
                    endedReason: 'returned',
                    endedAt: new Date(),
                },
            },
        );

        await expect(runDown()).rejects.toThrow(/status 'ended'/i);
    });

    it('down aborts when an Assignment has been modified (updatedAt > createdAt)', async () => {
        const seeded = await seedLockerRaw();
        await runUp();

        // Mongoose timestamps bump updatedAt on save; we simulate by direct
        // $set so the abort check triggers.
        await mongoose.connection.db.collection('assignments').updateOne(
            { lockerId: seeded._id },
            {
                $set: {
                    updatedAt: new Date(Date.now() + 60_000),
                    employeeName: 'Alice (corrected)',
                },
            },
        );

        await expect(runDown()).rejects.toThrow(/modified since creation/i);
    });

    it('down aborts on orphan Assignment (lockerId points at no Locker)', async () => {
        const seeded = await seedLockerRaw();
        await runUp();

        // Delete the Locker but leave the Assignment.
        await mongoose.connection.db
            .collection('lockers')
            .deleteOne({ _id: seeded._id });

        await expect(runDown()).rejects.toThrow(
            /lockerId that no longer exists/i,
        );
    });
});
