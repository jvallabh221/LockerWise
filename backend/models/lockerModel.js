const mongoose = require('mongoose');

const enumNormalizer = (map) => (value) => {
    if (!value) return value;
    const key = String(value).toLowerCase();
    return map[key] || value;
};

const lockerSchema = new mongoose.Schema(
    {
        // LockerType,LockerStatus,LockerNumber,LockerCode,
        LockerType: {
            type: String,
            // required: true,
            enum: ['half', 'full'],
            set: enumNormalizer({ half: 'half', full: 'full' }),
        },
        LockerStatus: {
            type: String,
            enum: ['occupied', 'available', 'expired'],
            default: 'available',
        },
        buildingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Building',
        },
        floorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Floor',
        },
        zoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Zone',
            default: null,
        },
        LockerNumber: {
            type: Number,
            // Uniqueness is scoped to buildingId — see compound index below.
        },
        LockerCode: {
            type: String,
        },
        LockerSerialNumber: {
            type: String,
        },
        LockerCodeCombinations: {
            type: [String],
        },
        LockerPrice3Month: {
            type: Number,
            // required: true,
        },
        LockerPrice6Month: {
            type: Number,
            // required: true,
        },
        LockerPrice12Month: {
            type: Number,
            // required: true,
        },
        availableForGender: {
            type: String,
            // required: true,
            enum: ['Male', 'Female'],
            set: enumNormalizer({ male: 'Male', female: 'Female' }),
        },
        employeeName: {
            type: String,
            default: 'N/A',
        },
        employeeId: {
            type: String,
        },
        employeeEmail: {
            type: String,
        },
        employeePhone: {
            type: String,
        },
        employeeGender: {
            type: String,
            enum: ['Male', 'Female', 'None'],
        },
        CostToEmployee: {
            type: Number,
            default: 0,
        },
        Duration: {
            type: String,
        },
        StartDate: {
            type: Date,
        },
        EndDate: {
            type: Date,
        },
        expiresOn: {
            type: Date,
        },
        emailSent: { // New field to track email notification status
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Uniqueness of LockerNumber is scoped to Building. A1 replaces the original
// global unique index; B6 later refines this to a partial filter on
// { deletedAt: null } so soft-deleted lockers don't block new numbers.
lockerSchema.index({ buildingId: 1, LockerNumber: 1 }, { unique: true });

// A1-transitional: buildingId/floorId are optional in the schema so existing
// controllers keep working while A1 backfills old data. Warn (don't block) on
// Locker creation without a building. A5.1 flips this to required and removes
// this hook once every creation site sets the ref.
lockerSchema.pre('save', function (next) {
    if (this.isNew && !this.buildingId) {
        console.warn(JSON.stringify({
            level: 'warn',
            event: 'locker.created_without_buildingId',
            lockerNumber: this.LockerNumber,
            lockerId: this._id ? String(this._id) : undefined,
            reason: 'A1-transitional — required enforcement comes in A5.1',
        }));
    }
    next();
});

// A2.0-transitional: `currentAssignment` is a Mongoose virtual so code that
// previously read `locker.employeeName` can migrate to
// `locker.currentAssignment?.employeeName` incrementally. DEPRECATED — A3
// makes this semantically ambiguous (one Assignment, many Holders) and
// A2.0.1 removes this virtual. New code should query `Assignment` directly.
lockerSchema.virtual('currentAssignment', {
    ref: 'Assignment',
    localField: '_id',
    foreignField: 'lockerId',
    justOne: true,
    match: { status: 'active', deletedAt: null },
});

module.exports = mongoose.model('Locker', lockerSchema);