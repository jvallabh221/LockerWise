const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
    {
        LockerNumber: {
            type: Number,
        },
        comment : {
            type: String,
            default: "",
        },
        LockerHolder: {
            type: String,
            default: "N/A",
        },
        InitiatedBy: {
            type: String,
            default: "Admin",
        },
        Cost: {
            type: Number,
            default: 0,
        },
        LockerStatus: {
            type: String,
            default: "Available",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('History', historySchema);