// flattenLockerResponse — the shape-preserving adapter between the new
// Assignment collection and the existing API response shape that clients
// (frontend + any external integration) depend on.
//
// Before A2.0.1, the 11 assignment-related fields lived directly on each
// Locker document. After A2.0.1, they live on Assignment; the API response
// still flattens them onto the locker body so consumers don't have to
// follow a `currentAssignment` nested path.
//
// This helper does NOT use the `currentAssignment` Mongoose virtual —
// queries Assignment directly so the virtual can be removed cleanly in
// the final A2.0.1 commit.

const Assignment = require('../models/assignmentModel.js');

// Default values for an unassigned locker. These match what
// cancelLockerAllocation produced pre-A2.0.1 (empty strings for dates,
// 'N/A' for name, 0 for cost, etc.) — changing any of these is a
// response-shape break.
const DEFAULTS = Object.freeze({
    employeeName: 'N/A',
    employeeId: '',
    employeeEmail: '',
    employeePhone: '',
    employeeGender: 'None',
    CostToEmployee: 0,
    Duration: '',
    // TODO(phase-2): migrate empty-string date defaults to null; tech debt
    // tracked. Keeping '' preserves pre-A2.0.1 API shape exactly.
    StartDate: '',
    EndDate: '',
    expiresOn: '',
    emailSent: false,
});

const ASSIGNMENT_FIELDS = Object.freeze(Object.keys(DEFAULTS));
const ASSIGNMENT_FIELD_SET = Object.freeze(new Set(ASSIGNMENT_FIELDS));

function toPojo(maybeDoc) {
    if (!maybeDoc) return maybeDoc;
    return typeof maybeDoc.toObject === 'function'
        ? maybeDoc.toObject()
        : maybeDoc;
}

function mergeAssignmentIntoLocker(lockerPojo, assignmentPojo) {
    const merged = { ...lockerPojo };
    if (assignmentPojo) {
        for (const f of ASSIGNMENT_FIELDS) {
            const v = assignmentPojo[f];
            merged[f] = v === undefined || v === null ? DEFAULTS[f] : v;
        }
    } else {
        for (const f of ASSIGNMENT_FIELDS) {
            merged[f] = DEFAULTS[f];
        }
    }
    return merged;
}

async function flattenLocker(lockerDoc) {
    const lockerPojo = toPojo(lockerDoc);
    if (!lockerPojo) return lockerPojo;
    const asgn = await Assignment.findOne({
        lockerId: lockerPojo._id,
        status: 'active',
        deletedAt: null,
    }).lean();
    return mergeAssignmentIntoLocker(lockerPojo, asgn);
}

async function flattenLockers(lockerDocs) {
    if (!Array.isArray(lockerDocs) || lockerDocs.length === 0) return [];
    const pojos = lockerDocs.map(toPojo);
    const ids = pojos.map((l) => l._id);
    const asgns = await Assignment.find({
        lockerId: { $in: ids },
        status: 'active',
        deletedAt: null,
    }).lean();
    const byLocker = new Map(
        asgns.map((a) => [String(a.lockerId), a]),
    );
    return pojos.map((l) =>
        mergeAssignmentIntoLocker(l, byLocker.get(String(l._id))),
    );
}

module.exports = {
    flattenLocker,
    flattenLockers,
    mergeAssignmentIntoLocker,
    DEFAULTS,
    ASSIGNMENT_FIELDS,
    ASSIGNMENT_FIELD_SET,
};
