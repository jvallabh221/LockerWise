const path = require('path');
const mongoose = require('mongoose');
const migrateMongo = require('migrate-mongo');
const migrateMongoConfig = require('../../../migrate-mongo-config.js');

const MAIN_BUILDING = 'Main Building';
const DEFAULT_FLOOR = 'Default Floor';
const MIGRATION_FILE = '20260424150000-building-floor-zone-hierarchy.js';

// Drive migrate-mongo's JS API against the Mongoose-managed memory-server
// connection from tests/helpers/testDb.js. Bypasses migrate-mongo's own
// connect/disconnect so we share the one connection Vitest already owns.
function configureMigrateMongo() {
    migrateMongo.config.set({
        ...migrateMongoConfig,
        migrationsDir: path.resolve(__dirname, '../../../migrations'),
    });
}

async function runUp() {
    configureMigrateMongo();
    return migrateMongo.up(
        mongoose.connection.db,
        mongoose.connection.getClient(),
    );
}

async function runDown() {
    configureMigrateMongo();
    return migrateMongo.down(
        mongoose.connection.db,
        mongoose.connection.getClient(),
    );
}

async function seedLockersRaw(count) {
    const docs = [];
    for (let i = 1; i <= count; i += 1) {
        docs.push({
            LockerNumber: 100 + i,
            LockerStatus: 'available',
        });
    }
    await mongoose.connection.db.collection('lockers').insertMany(docs);
}

// File-scoped cleanup: fully drop collections (data + indexes) so each test
// starts with a clean slate. The global afterEach in testDb.js only clears
// docs, not indexes, which would couple tests.
async function nukeCollections() {
    const db = mongoose.connection.db;
    for (const coll of [
        'lockers',
        'buildings',
        'floors',
        'zones',
        'migrations_changelog',
        'migrations_changelog_lock',
    ]) {
        await db.collection(coll).drop().catch(() => {});
    }
}

describe('A1 migration: Building/Floor/Zone hierarchy', () => {
    beforeEach(async () => {
        await nukeCollections();
    });

    afterEach(async () => {
        await nukeCollections();
    });

    it('up backfills existing Lockers with defaults and sets zoneId to null', async () => {
        await seedLockersRaw(3);
        const applied = await runUp();
        expect(applied).toContain(MIGRATION_FILE);

        const db = mongoose.connection.db;
        const buildings = await db.collection('buildings').find().toArray();
        const floors = await db.collection('floors').find().toArray();
        const lockers = await db.collection('lockers').find().toArray();

        expect(buildings).toHaveLength(1);
        expect(buildings[0].name).toBe(MAIN_BUILDING);
        expect(buildings[0].timezone).toBe('UTC');
        expect(buildings[0].address).toBeNull();
        expect(buildings[0].deletedAt).toBeNull();

        expect(floors).toHaveLength(1);
        expect(floors[0].name).toBe(DEFAULT_FLOOR);
        expect(floors[0].wing).toBeNull();
        expect(floors[0].buildingId.toString()).toBe(
            buildings[0]._id.toString(),
        );

        expect(lockers).toHaveLength(3);
        for (const l of lockers) {
            expect(l.buildingId.toString()).toBe(buildings[0]._id.toString());
            expect(l.floorId.toString()).toBe(floors[0]._id.toString());
            expect(l.zoneId).toBeNull();
        }
    });

    it('up is idempotent at the function level (no duplicate defaults)', async () => {
        await seedLockersRaw(3);
        await runUp();

        // Simulate someone clearing the changelog and re-running up.
        await mongoose.connection.db
            .collection('migrations_changelog')
            .deleteMany({});
        await runUp();

        const db = mongoose.connection.db;
        expect(await db.collection('buildings').countDocuments()).toBe(1);
        expect(await db.collection('floors').countDocuments()).toBe(1);
    });

    it('compound index enforces uniqueness on (buildingId, LockerNumber)', async () => {
        await seedLockersRaw(3);
        await runUp();

        const db = mongoose.connection.db;
        const mainBuilding = await db
            .collection('buildings')
            .findOne({ name: MAIN_BUILDING });
        const defaultFloor = await db
            .collection('floors')
            .findOne({ name: DEFAULT_FLOOR });

        // One of the seeded lockers already has LockerNumber = 101. Try to
        // insert another with the same (buildingId, LockerNumber) pair.
        await expect(
            db.collection('lockers').insertOne({
                LockerNumber: 101,
                LockerStatus: 'available',
                buildingId: mainBuilding._id,
                floorId: defaultFloor._id,
                zoneId: null,
            }),
        ).rejects.toThrow(/duplicate key/i);
    });

    it('down reverses cleanly when no manual data was added', async () => {
        await seedLockersRaw(3);
        await runUp();
        const rolledBack = await runDown();
        expect(rolledBack).toContain(MIGRATION_FILE);

        const db = mongoose.connection.db;
        expect(await db.collection('buildings').countDocuments()).toBe(0);
        expect(await db.collection('floors').countDocuments()).toBe(0);
        expect(await db.collection('zones').countDocuments()).toBe(0);

        const lockers = await db.collection('lockers').find().toArray();
        expect(lockers).toHaveLength(3);
        for (const l of lockers) {
            expect(l.buildingId).toBeUndefined();
            expect(l.floorId).toBeUndefined();
            expect(l.zoneId).toBeUndefined();
        }

        const lockerIndexes = await db.collection('lockers').indexes();
        expect(
            lockerIndexes.find((i) => i.name === 'LockerNumber_1'),
        ).toBeDefined();
        expect(
            lockerIndexes.find((i) => i.name === 'buildingId_1_LockerNumber_1'),
        ).toBeUndefined();
    });

    it('down aborts when a Locker has a non-default buildingId', async () => {
        await seedLockersRaw(3);
        await runUp();

        const db = mongoose.connection.db;
        const secondBuildingRes = await db.collection('buildings').insertOne({
            name: 'North Tower',
            address: null,
            timezone: 'UTC',
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await db
            .collection('lockers')
            .updateOne(
                { LockerNumber: 101 },
                { $set: { buildingId: secondBuildingRes.insertedId } },
            );

        await expect(runDown()).rejects.toThrow(
            /non-default|buildingId that is not the Main Building/i,
        );
    });

    it('down aborts when an orphan Building exists', async () => {
        await seedLockersRaw(3);
        await runUp();

        await mongoose.connection.db.collection('buildings').insertOne({
            name: 'South Tower',
            address: null,
            timezone: 'UTC',
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await expect(runDown()).rejects.toThrow(
            /non-default Building/i,
        );
    });

    it('down aborts when an orphan Floor exists', async () => {
        await seedLockersRaw(3);
        await runUp();

        const db = mongoose.connection.db;
        const mainBuilding = await db
            .collection('buildings')
            .findOne({ name: MAIN_BUILDING });
        await db.collection('floors').insertOne({
            buildingId: mainBuilding._id,
            name: 'Mezzanine',
            wing: null,
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await expect(runDown()).rejects.toThrow(/non-default Floor/i);
    });

    it('down aborts when any Zone exists', async () => {
        await seedLockersRaw(3);
        await runUp();

        const db = mongoose.connection.db;
        const defaultFloor = await db
            .collection('floors')
            .findOne({ name: DEFAULT_FLOOR });
        await db.collection('zones').insertOne({
            floorId: defaultFloor._id,
            name: 'Section A',
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await expect(runDown()).rejects.toThrow(/Zone/);
    });
});
