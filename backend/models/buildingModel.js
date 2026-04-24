const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, default: null },
        timezone: { type: String, required: true, default: 'UTC' },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Unique on name. B6 refines this to partialFilterExpression: { deletedAt: null }
// when soft-delete ships so renamed-then-recreated buildings work.
buildingSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Building', buildingSchema);
