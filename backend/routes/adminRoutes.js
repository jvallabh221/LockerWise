const express = require('express');
const verifyToken=require('../utils/verifyUser.js')
const router = express.Router();
const XLSX = require('xlsx');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const axios = require('axios'); // Import axios
const { addStaff,removeStaff,editStaff,viewStaffDetails,viewAllStaff, addLocker, addMultipleLocker, viewFullHistory, clearHistory } = require('../controllers/adminControllers.js');

router.post('/addStaff', verifyToken(['Admin']),addStaff);
router.post('/removeStaff',verifyToken(['Admin']), removeStaff);
router.put('/editStaff', verifyToken(['Admin']),editStaff);
router.get('/viewAllStaff', verifyToken(['Admin']),viewAllStaff);
router.post('/viewStaffDetails',verifyToken(['Admin']), viewStaffDetails);
router.post('/addSingleLocker', verifyToken(['Admin']),addLocker);
router.post('/addMultipleLocker', verifyToken(['Admin']), addMultipleLocker);
router.get('/viewFullHistory', verifyToken(['Admin']),viewFullHistory);
router.post('/clearHistory', verifyToken(['Admin']),clearHistory);

const COLUMN_MAPPING = {
    0: "LockerType",
    1: "LockerNumber",
    2: "combination1",
    3: "combination2",
    4: "combination3",
    5: "combination4",
    6: "combination5",
    7: "LockerPrice3Month",
    8: "LockerPrice6Month",
    9: "LockerPrice12Month",
    10: "availableForGender",
    11: "LockerSerialNumber"
};
  
router.post('/upload-excel', verifyToken(['Admin']), upload.single('file'), async (req, res) => {
    try {
        const buffer = req.file.buffer;
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        // Skip the first row (header) and map rows to locker objects
        const data = rows.slice(1).map((row) => {
            let mappedRow = {};

            row.forEach((cell, index) => {
                const columnKey = COLUMN_MAPPING[index];
                if (columnKey) {
                // Create the LockerCodeCombinations array by combining combination columns
                if (columnKey.startsWith("combination")) {
                    if (!mappedRow.LockerCodeCombinations) mappedRow.LockerCodeCombinations = [];
                    mappedRow.LockerCodeCombinations.push(cell);
                } else {
                    // Map other fields directly
                    mappedRow[columnKey] = cell;
                }
                }
            });

            return mappedRow;
        });

        // Send data array directly in the request body to match addMultipleLocker
        const token = req.headers.authorization.split(' ')[1];
        const response = await axios.post(`${process.env.BACKEND_URL}/api/admin/addMultipleLocker`, data,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 201) {
            res.status(201).json({ message: "File processed and lockers added successfully", data });
        } else {
            res.status(response.status).json({ message: "Failed to add lockers", details: response.data });
        }
    } catch (err) {
        res.status(err.status || 500).json({ message: `Error processing file: ${err.message}` });
    }
});

module.exports = router;