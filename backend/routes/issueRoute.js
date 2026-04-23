const express = require('express');
const router = express.Router();

const { raiseTechnicalIssue, raiseLockerIssue, updateIssue,resolveIssue, deleteIssue, getLockerIssue,getTechnicalIssue, getAllIssues, updateComment } = require('../controllers/issueController.js');
const verifyToken=require('../utils/verifyUser.js')


router.post('/raiseTechnicalIssue', verifyToken(['Admin','Staff']), raiseTechnicalIssue);
router.post('/raiseLockerIssue',verifyToken(['Admin','Staff']), raiseLockerIssue);
router.put('/updateIssue',verifyToken(['Admin']), updateIssue);
router.put('/resolveIssue',verifyToken(['Admin']), resolveIssue);
router.get('/getAllIssue',verifyToken(['Admin','Staff']), getAllIssues);
router.post('/deleteIssue', verifyToken(['Staff']), deleteIssue);
router.put('/updateComment',verifyToken(['Admin','Staff']), updateComment);

module.exports = router;