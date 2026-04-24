#!/usr/bin/env node
/**
 * backend/scripts/verifyMigrations.js
 *
 * First-class reusable tool for every Phase 1 migration PR.
 *
 * Boots an ephemeral mongodb-memory-server, points migrate-mongo at it,
 * and drives a full status → up → status → down → status cycle against
 * every committed migration. Tears the memory-server down on exit.
 *
 * Usage:
 *   node backend/scripts/verifyMigrations.js
 *
 * Works from any cwd; the script chdirs to backend/ so migrate-mongo
 * finds ./migrations relative to the config file.
 *
 * Never connects to a real database. The memory-server URI is assigned
 * to process.env.DBURL inside this process only — it does not leak out.
 * See memory/feedback_never_verify_migrations_against_prod.md.
 */

const path = require('path');

// Ensure migrate-mongo resolves ./migrations relative to backend/.
process.chdir(path.join(__dirname, '..'));

const { MongoMemoryServer } = require('mongodb-memory-server');
const migrateMongo = require('migrate-mongo');

async function main() {
    const memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    process.env.DBURL = uri;

    console.log('=== Verifying migrations against memory-server ===');
    console.log(`URI: ${uri}`);
    console.log('Confirmed NOT production: ephemeral, in-memory, destroyed at exit.');
    console.log('');

    migrateMongo.config.set(require(path.resolve('migrate-mongo-config.js')));

    let client;
    let exitCode = 0;
    try {
        const conn = await migrateMongo.database.connect();
        client = conn.client;
        const { db } = conn;

        console.log('--- status (before up) ---');
        console.table(await migrateMongo.status(db));

        console.log('\n--- up ---');
        const applied = await migrateMongo.up(db, client);
        if (applied.length === 0) {
            console.log('  (none)');
        } else {
            applied.forEach((name) => console.log(`  up: ${name}`));
        }

        console.log('\n--- status (after up) ---');
        console.table(await migrateMongo.status(db));

        console.log('\n--- down ---');
        const rolled = await migrateMongo.down(db, client);
        if (rolled.length === 0) {
            console.log('  (none)');
        } else {
            rolled.forEach((name) => console.log(`  down: ${name}`));
        }

        console.log('\n--- status (after down) ---');
        console.table(await migrateMongo.status(db));

        console.log('\n=== Verification complete ===');
    } catch (err) {
        console.error('\nVerification FAILED:', err);
        exitCode = 1;
    } finally {
        if (client) await client.close();
        await memoryServer.stop();
    }

    process.exit(exitCode);
}

main();
