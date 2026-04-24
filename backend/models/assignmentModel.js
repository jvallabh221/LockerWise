const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
    {
        lockerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Locker',
            required: true,
        },

        // Flat holder fields. A2 replaces these with a `holderId` ref to the
        // Holder collection (dedupes the employee records). Until A2 lands,
        // these are the canonical holder fields on an Assignment.
        employeeName: { type: String, default: 'N/A' },
        employeeId: { type: String },
        employeeEmail: { type: String },
        employeePhone: { type: String },
        employeeGender: { type: String, enum: ['Male', 'Female', 'None'] },

        // Pricing + period.
        CostToEmployee: { type: Number, default: 0 },
        Duration: { type: String },
        StartDate: { type: Date },
        EndDate: { type: Date },
        expiresOn: { type: Date },
        emailSent: { type: Boolean, default: false },

        // Lifecycle. 'reserved' is enum-only in A2.0 (unused); C5
        // soft-reservation and Phase 2 reservations populate it.
        status: {
            type: String,
            enum: ['active', 'ended', 'reserved'],
            default: 'active',
        },
        endedAt: { type: Date, default: null },
        endedReason: {
            type: String,
            enum: [null, 'returned', 'cancelled', 'expired'],
            default: null,
        },

        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Query helper: assignments for a locker, filtered by status.
assignmentSchema.index({ lockerId: 1, status: 1 });

// At most one active Assignment per Locker. A3 keeps this — shared lockers
// share one Assignment across multiple Holders, not multiple Assignments.
// B6 will refine this to also include `deletedAt: null` in the partial
// filter once soft-delete filtering lands.
assignmentSchema.index(
    { lockerId: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'active' },
        name: 'lockerId_1_active_unique',
    }
);

// Cron reads (A2.0 expiry email + expiry-status jobs query by expiresOn).
assignmentSchema.index({ expiresOn: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
