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
        // The 11 assignment-related fields (employeeName, employeeId,
        // employeeEmail, employeePhone, employeeGender, CostToEmployee,
        // Duration, StartDate, EndDate, expiresOn, emailSent) were removed
        // from this schema in A2.0.1. They now live on the Assignment
        // collection — see backend/models/assignmentModel.js. Responses
        // that used to embed them on the Locker body continue to do so
        // via backend/utils/flattenLockerResponse.js.
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

// The `currentAssignment` virtual that existed during A2.0 is removed in
// A2.0.1 — it was an A2.0 → A2.0.1 transitional shim that stopped earning
// its keep once every consumer migrated to explicit Assignment queries
// (via backend/utils/flattenLockerResponse.js).

module.exports = mongoose.model('Locker', lockerSchema);