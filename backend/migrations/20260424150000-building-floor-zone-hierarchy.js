// A1 — Building/Floor/Zone hierarchy + backfill existing Lockers.
//
// Idempotent by construction: re-running up on the same database produces
// the same state (upserts, index creations are no-ops when specs match).
//
// Down aborts when it detects manual data added after the up ran, to
// avoid corrupting it: non-default Locker buildingId, orphan Buildings,
// orphan Floors, or any Zone doc (A1 does not create Zones).

const MAIN_BUILDING_NAME = 'Main Building';
const DEFAULT_FLOOR_NAME = 'Default Floor';

async function hasIndex(collection, indexName) {
    const indexes = await collection.indexes().catch(() => []);
    return indexes.some((idx) => idx.name === indexName);
}

module.exports = {
    async up(db, client) {
        const now = new Date();

        // 1. Upsert Main Building (idempotent).
        await db.collection('buildings').updateOne(
            { name: MAIN_BUILDING_NAME },
            {
                $setOnInsert: {
                    name: MAIN_BUILDING_NAME,
                    address: null,
                    timezone: 'UTC',
                    deletedAt: null,
                    createdAt: now,
                    updatedAt: now,
                },
            },
            { upsert: true },
        );
        const mainBuilding = await db
            .collection('buildings')
            .findOne({ name: MAIN_BUILDING_NAME });

        // 2. Upsert Default Floor (idempotent, scoped to Main Building).
        await db.collection('floors').updateOne(
            { buildingId: mainBuilding._id, name: DEFAULT_FLOOR_NAME },
            {
                $setOnInsert: {
                    buildingId: mainBuilding._id,
                    name: DEFAULT_FLOOR_NAME,
                    wing: null,
                    deletedAt: null,
                    createdAt: now,
                    updatedAt: now,
                },
            },
            { upsert: true },
        );
        const defaultFloor = await db.collection('floors').findOne({
            buildingId: mainBuilding._id,
            name: DEFAULT_FLOOR_NAME,
        });

        // 3. Backfill Lockers missing buildingId.
        await db.collection('lockers').updateMany(
            { buildingId: { $exists: false } },
            {
                $set: {
                    buildingId: mainBuilding._id,
                    floorId: defaultFloor._id,
                    zoneId: null,
                },
            },
        );

        // 4. Drop the old global unique index on LockerNumber if present.
        if (await hasIndex(db.collection('lockers'), 'LockerNumber_1')) {
            await db.collection('lockers').dropIndex('LockerNumber_1');
        }

        // 5. Create compound unique index. createIndex is idempotent when
        // the spec matches the existing index.
        await db.collection('lockers').createIndex(
            { buildingId: 1, LockerNumber: 1 },
            { unique: true, name: 'buildingId_1_LockerNumber_1' },
        );

        // 6. Uniqueness indexes on the three new collections.
        await db
            .collection('buildings')
            .createIndex({ name: 1 }, { unique: true, name: 'name_1' });
        await db
            .collection('floors')
            .createIndex(
                { buildingId: 1, name: 1 },
                { unique: true, name: 'buildingId_1_name_1' },
            );
        await db
            .collection('zones')
            .createIndex(
                { floorId: 1, name: 1 },
                { unique: true, name: 'floorId_1_name_1' },
            );
    },

    async down(db, client) {
        const mainBuilding = await db
            .collection('buildings')
            .findOne({ name: MAIN_BUILDING_NAME });
        const defaultFloor = mainBuilding
            ? await db.collection('floors').findOne({
                  buildingId: mainBuilding._id,
                  name: DEFAULT_FLOOR_NAME,
              })
            : null;

        // Abort guards — preserve manual data added after up.
        if (mainBuilding) {
            const nonDefaultLockers = await db
                .collection('lockers')
                .countDocuments({
                    buildingId: { $exists: true, $ne: mainBuilding._id },
                });
            if (nonDefaultLockers > 0) {
                throw new Error(
                    `Refusing to reverse A1: ${nonDefaultLockers} locker(s) reference a ` +
                        `buildingId that is not the Main Building. Manual data was added after ` +
                        `the migration ran. Move those lockers back to the Main Building (or ` +
                        `delete them) before running down.`,
                );
            }

            const orphanBuildings = await db
                .collection('buildings')
                .countDocuments({ _id: { $ne: mainBuilding._id } });
            if (orphanBuildings > 0) {
                throw new Error(
                    `Refusing to reverse A1: ${orphanBuildings} non-default Building doc(s) exist. ` +
                        `Delete them before running down.`,
                );
            }

            const defaultFloorId = defaultFloor ? defaultFloor._id : null;
            const orphanFloors = await db.collection('floors').countDocuments(
                defaultFloorId
                    ? { _id: { $ne: defaultFloorId } }
                    : {},
            );
            if (orphanFloors > 0) {
                throw new Error(
                    `Refusing to reverse A1: ${orphanFloors} non-default Floor doc(s) exist. ` +
                        `Delete them before running down.`,
                );
            }
        }

        const anyZones = await db.collection('zones').countDocuments({});
        if (anyZones > 0) {
            throw new Error(
                `Refusing to reverse A1: ${anyZones} Zone doc(s) exist. A1 does not create ` +
                    `Zones, so their presence means manual data. Delete before running down.`,
            );
        }

        // 1. Unset refs on all Lockers.
        await db
            .collection('lockers')
            .updateMany(
                {},
                { $unset: { buildingId: '', floorId: '', zoneId: '' } },
            );

        // 2. Drop compound index, restore global unique index.
        if (
            await hasIndex(
                db.collection('lockers'),
                'buildingId_1_LockerNumber_1',
            )
        ) {
            await db
                .collection('lockers')
                .dropIndex('buildingId_1_LockerNumber_1');
        }
        if (!(await hasIndex(db.collection('lockers'), 'LockerNumber_1'))) {
            await db
                .collection('lockers')
                .createIndex(
                    { LockerNumber: 1 },
                    { unique: true, name: 'LockerNumber_1' },
                );
        }

        // 3. Delete the sentinel docs.
        if (defaultFloor) {
            await db.collection('floors').deleteOne({ _id: defaultFloor._id });
        }
        if (mainBuilding) {
            await db
                .collection('buildings')
                .deleteOne({ _id: mainBuilding._id });
        }

        // 4. Drop uniqueness indexes on the new collections (safe: empty).
        for (const [coll, name] of [
            ['buildings', 'name_1'],
            ['floors', 'buildingId_1_name_1'],
            ['zones', 'floorId_1_name_1'],
        ]) {
            if (await hasIndex(db.collection(coll), name)) {
                await db.collection(coll).dropIndex(name);
            }
        }
    },
};
