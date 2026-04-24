const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema(
    {
        buildingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Building',
            required: true,
        },
        name: { type: String, required: true },
        wing: { type: String, default: null },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

floorSchema.index({ buildingId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Floor', floorSchema);
