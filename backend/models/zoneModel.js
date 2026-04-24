const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema(
    {
        floorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Floor',
            required: true,
        },
        name: { type: String, required: true },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

zoneSchema.index({ floorId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Zone', zoneSchema);
