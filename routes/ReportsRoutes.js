const express = require('express');
const router = express.Router();
const {
    addNewReport,
    getReportsOfSpecMonth,
    getSingleReport,
    getUnPaidReportsOfSpecMonth,
} = require('../controllers/ReoprtControllers')


// add new Report
router.post('/api/reports/addNew', addNewReport)

// getting reports of specific months
router.get('/api/reports/getAllReportsInMonth/:startDate/:endDate/:site', getReportsOfSpecMonth)

// getting all unpaid workers in any specific month
router.get('/api/reports/getAllUnPaidWorkersInSpecMonth/:startDate/:endDate/:site', getUnPaidReportsOfSpecMonth)

// getting single report
router.get('/api/reports/getSingleReport/:id', getSingleReport)

module.exports = router;