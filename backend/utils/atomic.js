const mongoose = require('mongoose');

/**
 * Transaction compatibility layer.
 *
 * MongoDB multi-document transactions require a replica set or a mongos
 * (sharded cluster). A single-container MongoDB (the default on Railway
 * and most managed dev setups) is a standalone and rejects transactions
 * with `Transaction numbers are only allowed on a replica set member
 * or mongos`.
 *
 * This helper transparently falls back to plain writes on a standalone
 * server. Every Mongoose write inside `fn` should pass `{ session }`
 * through unconditionally — Mongoose treats `session: null` as "no
 * session", so the same controller code works in both modes.
 *
 *   await withAtomic(async (session) => {
 *       await Locker.create([{ ... }], { session });
 *       await History.create([{ ... }], { session });
 *   });
 *
 * Detection is done once at the first call and cached, so the overhead
 * is a single `hello` command per process lifetime.
 */

let _supported = null;

async function supportsTransactions() {
    if (_supported !== null) return _supported;
    try {
        if (!mongoose.connection?.db) {
            // Not yet connected; assume false for this call, re-detect later.
            return false;
        }
        const admin = mongoose.connection.db.admin();
        const info = await admin.command({ hello: 1 });
        _supported = !!info.setName || info.msg === 'isdbgrid';
    } catch (_) {
        _supported = false;
    }
    return _supported;
}

async function withAtomic(fn) {
    if (!(await supportsTransactions())) {
        return fn(null);
    }

    const session = await mongoose.startSession();
    try {
        let result;
        await session.withTransaction(async () => {
            result = await fn(session);
        });
        return result;
    } finally {
        session.endSession();
    }
}

module.exports = { withAtomic, supportsTransactions };
