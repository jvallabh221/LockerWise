const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema(
    {
        LockerType: {
            type: String,
            required: true,
            enum: ['half', 'full'], // Limit to valid locker types
        },
        availableForGender: {
            type: String,
            required: true,
            enum: ['Male', 'Female'], // Limit to valid genders
        },
        LockerPrice3Month: {
            type: Number,
            default: 0, // Default price if not provided
        },
        LockerPrice6Month: {
            type: Number,
            default: 0,
        },
        LockerPrice12Month: {
            type: Number,
            default: 0,
        },
    },
    { 
        timestamps: true,
        collection: 'prices', //Collection name
    }
);

priceSchema.index({ LockerType: 1, availableForGender: 1 }, { unique: true });

module.exports = mongoose.model('Price', priceSchema);