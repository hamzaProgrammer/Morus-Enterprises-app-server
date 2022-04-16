const express = require('express');
const router = express.Router();
const {
    addNewSite,
    getAllSites,
    getSingleSite,
    addCashToSite
} = require('../controllers/SitesController')


// Sign Up Admin
router.post('/api/sites/addNew', addNewSite)

// getting all sites of an admin
router.get('/api/sites/getAllOfAdmin/:owner', getAllSites)

// getting single sites of an admin
router.get('/api/sites/getSingleSiteOfAdmin/:id/:owner', getSingleSite)

// adding cash to site
router.put('/api/sites/addCashToSite/:id/:owner', addCashToSite)


module.exports = router;