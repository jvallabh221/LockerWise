// A2.0 — Create Assignment collection + backfill from currently-assigned
// Lockers (copy, not move — Locker fields stay put; A2.0.1 does the $unset).
//
// Idempotent: re-running up on the same database produces the same state
// (upsert keyed on { lockerId, status: 'active' }; indexes are no-ops when
// specs match).
//
// Down aborts when manual post-migration data is detected:
//   - any Assignment has status === 'ended'
//   - any Assignment's updatedAt > createdAt (doc was modified)
//   - any Assignment's lockerId points at a nonexistent Locker (orphan)

async function hasIndex(collection, indexName) {
    const indexes = await collection.indexes().catch(() => []);
    return indexes.some((idx) => idx.name === indexName);
}

module.exports = {
    async up(db, client) {
        const now = new Date();

        // Assigned-locker signature: employeeName is set AND not 'N/A',
        // AND StartDate is set. Rules out unassigned + partial/legacy docs.
        const assignedLockers = await db
            .collection('lockers')
            .find({
                employeeName: { $exists: true, $nin: [null, 'N/A'] },
                StartDate: { $exists: true, $ne: null },
            })
            .toArray();

        for (const locker of assignedLockers) {
            await db.collection('assignments').updateOne(
                { lockerId: locker._id, status: 'active' },
                {
                    $setOnInsert: {
                        lockerId: locker._id,
                        employeeName: locker.employeeName,
                        employeeId: locker.employeeId ?? null,
                        employeeEmail: locker.employeeEmail ?? null,
                        employeePhone: locker.employeePhone ?? null,
                        employeeGender: locker.employeeGender ?? null,
                        CostToEmployee: locker.CostToEmployee ?? 0,
                        Duration: locker.Duration ?? null,
                        StartDate: locker.StartDate ?? null,
                        EndDate: locker.EndDate ?? null,
                        expiresOn: locker.expiresOn ?? null,
                        emailSent: locker.emailSent ?? false,
                        status: 'active',
                        endedAt: null,
                        endedReason: null,
                        deletedAt: null,
                        createdAt: now,
                        updatedAt: now,
                    },
                },
                { upsert: true },
            );
        }

        // Indexes. createIndex is idempotent when the spec matches.
        await db
            .collection('assignments')
            .createIndex(
                { lockerId: 1, status: 1 },
                { name: 'lockerId_1_status_1' },
            );
        await db.collection('assignments').createIndex(
            { lockerId: 1 },
            {
                unique: true,
                partialFilterExpression: { status: 'active' },
                name: 'lockerId_1_active_unique',
            },
        );
        await db
            .collection('assignments')
            .createIndex({ expiresOn: 1 }, { name: 'expiresOn_1' });
    },

    async down(db, client) {
        // Abort: anything status='ended' means lifecycle events happened.
        const endedCount = await db
            .collection('assignments')
            .countDocuments({ status: 'ended' });
        if (endedCount > 0) {
            throw new Error(
                `Refusing to reverse A2.0: ${endedCount} Assignment(s) have ` +
                    `status 'ended'. Lifecycle events happened after the migration; ` +
                    `reversing would silently discard them.`,
            );
        }

        // Abort: updatedAt > createdAt means the doc was modified post-creation.
        const modifiedCount = await db
            .collection('assignments')
            .countDocuments({
                $expr: { $gt: ['$updatedAt', '$createdAt'] },
            });
        if (modifiedCount > 0) {
            throw new Error(
                `Refusing to reverse A2.0: ${modifiedCount} Assignment(s) have ` +
                    `been modified since creation (updatedAt > createdAt). ` +
                    `Investigate before running down.`,
            );
        }

        // Abort: orphan Assignments (lockerId points at nothing).
        const orphans = await db
            .collection('assignments')
            .aggregate([
                {
                    $lookup: {
                        from: 'lockers',
                        localField: 'lockerId',
                        foreignField: '_id',
                        as: '_locker',
                    },
                },
                { $match: { _locker: { $size: 0 } } },
                { $count: 'count' },
            ])
            .toArray();
        const orphanCount = orphans[0] ? orphans[0].count : 0;
        if (orphanCount > 0) {
            throw new Error(
                `Refusing to reverse A2.0: ${orphanCount} Assignment(s) reference ` +
                    `a lockerId that no longer exists. Investigate before running down.`,
            );
        }

        // Safe to reverse. Delete all Assignments and drop the three indexes.
        await db.collection('assignments').deleteMany({});

        for (const name of [
            'lockerId_1_status_1',
            'lockerId_1_active_unique',
            'expiresOn_1',
        ]) {
            if (await hasIndex(db.collection('assignments'), name)) {
                await db.collection('assignments').dropIndex(name);
            }
        }
    },
};
