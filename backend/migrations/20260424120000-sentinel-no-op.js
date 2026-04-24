// No-op sentinel. Probe/template only — confirms the migrate-mongo runner
// is wired end-to-end (config loads, migrations_changelog writes, up/down
// round-trips). Real schema migrations start at A1; copy this file's shape.

module.exports = {
    async up(db, client) {
        // No-op.
    },
    async down(db, client) {
        // No-op.
    },
};
