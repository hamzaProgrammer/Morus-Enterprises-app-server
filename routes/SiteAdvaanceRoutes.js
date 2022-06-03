const express = require('express');
const router = express.Router();
const {
    addNewSiteAdvance,
    getAllSiteAdvanceOfDate,
    addNewSiteAdvanceByManager
} = require('../controllers/SiteAdvanceControllers')
const multer = require("multer")
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './siteAdvancePics/')
        //cb(null, '../products')
    },
    filename: function (req, file, cb) {
        cb(null, 'image-' + Date.now() + file.originalname)
    }
})
const upload = multer({
    storage: storage,
});


// add new  site advance
router.post('/api/siteAdvances/addNew', addNewSiteAdvance)

// getting all attedences of workers all workers of yesterday
router.get('/api/siteAdvances/getAllSiteAdvancesofAWorkerofSpecificDate/:id/:site/:date', getAllSiteAdvanceOfDate)

// add new  site advance by manager
router.post('/api/siteAdvancesByManager/addNew', upload.single("picture") , addNewSiteAdvanceByManager)


module.exports = router;