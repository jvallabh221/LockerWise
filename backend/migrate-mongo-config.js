require('dotenv').config();

// migrate-mongo config. Loaded by the CLI (`migrate-mongo status/up/down`)
// and by `scripts/verifyMigrations.js`. DBURL comes from the environment —
// migrations are never auto-run; see README §Migrations for the rules.
module.exports = {
    mongodb: {
        url: process.env.DBURL,
        databaseName: undefined, // taken from the URL path
        options: {},
    },
    migrationsDir: 'migrations',
    changelogCollectionName: 'migrations_changelog',
    lockCollectionName: 'migrations_changelog_lock',
    lockTtl: 0,
    migrationFileExtension: '.js',
    useFileHash: false,
    moduleSystem: 'commonjs',
};
