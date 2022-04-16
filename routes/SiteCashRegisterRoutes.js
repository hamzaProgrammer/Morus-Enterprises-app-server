const express = require('express');
const router = express.Router();
const {
    addCashToSite,
    updateCashOfSite,
    getHistoryOfCashGiven,
    getHistoryOfCashGivenByManager,
    addCashToSiteByManager
} = require('../controllers/SitesCashRegisterController')


// add new site cash
router.post('/api/sitesCashRegisters/addNew/:id/:owner', addCashToSite)

// getting history of cash given to a site
router.get('/api/sitesCashRegisters/getCashHistoryOfASite/:id/:owner', getHistoryOfCashGiven)

// updating cash of site
router.put('/api/sitesCashRegisters/updateCashOfSite/:id/:owner', updateCashOfSite)

// getting history of cash given to a site
router.get('/api/sitesCashRegisters/getCashHistoryOfASiteByManager/:id/:manager', getHistoryOfCashGivenByManager)

// add new site cash by manager
router.post('/api/sitesCashRegistersNyManager/addNew/:id/:manager', addCashToSiteByManager)


module.exports = router;