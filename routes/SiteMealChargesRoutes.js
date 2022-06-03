const express = require('express');
const router = express.Router();
const {
    addExpenseToSite,
    updateExpenseOfSite,
    getHistoryOfMealChargesGiven,
    getSitePaymentHistory,
    getSitePaymentHistoryByManager,
    addExpenseToSiteByManager,
    getHistoryOfMealChargesGivenByManager
} = require('../controllers/SiteMealChargesControllers')


// add new site meal charges
router.post('/api/sitesMealCharges/addNew/:id/:owner', addExpenseToSite)

// getting history of meal charges given to a site
router.put('/api/sitesMealChargesRegisters/getMealChargeshHistoryOfASite/:id', getHistoryOfMealChargesGiven)

// updating cash of site
router.put('/api/sitesMealRegisters/updateExpenseOfSite/:id/:owner', updateExpenseOfSite)

// getting history of meal charges , site expenses
router.get('/api/sitesMealChargesRegisters/getExpensesHistory/:id/:owner/:userDate', getSitePaymentHistory)

// getting history of meal charges , site expenses by manager
router.get('/api/sitesMealChargesRegisters/getExpensesHistoryByManager/:id/:manager/:userDate', getSitePaymentHistoryByManager)

// add new site meal charges
router.post('/api/sitesMealChargesByManager/addNew/:id/:manager', addExpenseToSiteByManager)

// getting history of meal charges given to a site by manager
router.get('/api/sitesMealChargesRegisters/getMealChargeshHistoryOfASiteByManager/:id/:manager', getHistoryOfMealChargesGivenByManager)


module.exports = router;