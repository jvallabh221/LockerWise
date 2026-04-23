const express = require('express');
const router = express.Router();
const {
    getAvailableLocker,
    allocateLocker,
    renewLocker,
    cancelLockerAllocation,
    getAllLockers,
    getExpiringIn7daysLockers,
    deleteLocker,
    getLockerPrices,
    getExpiringToday,
    editLockerDetails,
    changeLockerStatus,
    updateMultipleLockerPrices
}
    = require('../controllers/lockerController.js');
const verifyToken=require('../utils/verifyUser.js');

router.post('/availableLocker',verifyToken(['Admin','Staff']), getAvailableLocker);
router.post('/allocateLocker',verifyToken(['Staff']), allocateLocker);
router.put('/renewLocker',verifyToken(['Staff']), renewLocker);
router.post('/deleteLocker',verifyToken(['Admin']), deleteLocker);
router.post('/cancelLocker', verifyToken(['Staff']),cancelLockerAllocation);
router.get('/allLockers',verifyToken(['Admin','Staff']), getAllLockers);
router.get('/expiringIn7daysLockers',verifyToken(['Admin']), getExpiringIn7daysLockers);
router.get('/expiringToday',verifyToken(['Admin']), getExpiringToday);
router.get('/getLockerPrices',verifyToken(['Admin','Staff']), getLockerPrices);
router.put('/editLockerDetails',verifyToken(['Admin','Staff']), editLockerDetails);
router.put('/changeLockerStatus',verifyToken(['Admin','Staff']), changeLockerStatus);

router.put('/updateMultipleLockerPrices',verifyToken(['Admin']), updateMultipleLockerPrices);

module.exports = router;