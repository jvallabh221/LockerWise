// A2.0 cron job 2: mark Assignments whose expiry has passed.
//
// Updates the Assignment's lifecycle (status='ended', endedReason='expired',
// endedAt=now) AND updates the Locker's LockerStatus='expired' — preserving
// the behavior cron had before the Assignment extraction.
//
// Must query Assignment (not Locker) so that A2.0.1's $unset of expiresOn
// from Locker doesn't silently leave expired assignments un-flagged.
//
// `now` is injectable for deterministic testing.

const Assignment = require('../models/assignmentModel.js');
const Locker = require('../models/lockerModel.js');

async function markExpiredAssignments({ now = new Date() } = {}) {
    const toExpire = await Assignment.find({
        expiresOn: { $lte: now },
        status: 'active',
    });

    let marked = 0;
    for (const asgn of toExpire) {
        asgn.status = 'ended';
        asgn.endedReason = 'expired';
        asgn.endedAt = now;
        await asgn.save();

        // Preserve pre-extraction cron behavior: the Locker's own status
        // still reflects "expired" for UI that reads LockerStatus directly.
        await Locker.updateOne(
            { _id: asgn.lockerId, LockerStatus: { $ne: 'expired' } },
            { $set: { LockerStatus: 'expired' } },
        );
        marked += 1;
    }

    return { considered: toExpire.length, marked };
}

module.exports = markExpiredAssignments;
