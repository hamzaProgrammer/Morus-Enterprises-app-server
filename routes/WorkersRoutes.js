const express = require('express');
const router = express.Router();
const {
    addNewWorker,
    getSingleWorker,
    getAllWorkers,
    changeActiveStatus,
    getAllActiveWorkers,
    getAllOfflineWorkers,
    addDetailsOfWorker,
    getAllWorkersOfSite,
    getWorkerPic,
    updateWorkerPic,
    updateWorkerProfile,
    generateReportOfWorker,
    changeRateOfWorker,
    getHomeAdvance,
    checkingIfWorker,
    generateReportOfWorkerOfCrntMonth,
    getAllPaidInSpecificMonth,
    getSingleWorkerDet,
    generateReportOfWorkerWidthoutHomeAdv,
    changeActiveStatusOnPaying,
    markeWorkerHomeAdvance,
    markWorkerAsPaid
} = require('../controllers/WorkersController')
const multer = require("multer")
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './siteAdvancePics/')
        //cb(null, '../products')
    },
    filename: function (req, file, cb) {
        cb(null, 'image-' + file.originalname.toLowerCase())
    }
})
const upload = multer({
    storage: storage,
});


// Sign Up worker
router.post('/api/workers/addNew', addNewWorker)

// getting all workers of an admin
router.get('/api/workers/getAllWorkersOfAdmin/:site', getAllWorkers)

// getting single worker of an admin
router.get('/api/workers/getSingleWorkerOfAdmin/:id/:site', getSingleWorker)

// getting single worker profile pic of an admin
router.get('/api/workers/getProfilePic/:id', getWorkerPic)

// updating worker profile pic
router.put('/api/workers/updatePic/:id', upload.single("profilePic") ,  updateWorkerPic)

// updating worker profile info
router.put('/api/workers/updateInfo/:id', updateWorkerProfile)

// changing status of single worker
router.put('/api/workers/updateStatusOfWorker/:id/:owner', changeActiveStatus)

// add details of single worker
router.put('/api/workers/addDetailsOfWorker/:id/:site', addDetailsOfWorker)

// getting all active workers of an admin
router.get('/api/workers/getAllActiveWorkersOfAdmin/:site', getAllActiveWorkers)

// getting all went home workers of an admin
router.get('/api/workers/getAllOfflineWorkersOfAdmin/:site', getAllOfflineWorkers)

// getting all workers of a site
router.get('/api/workers/getAllWorkersOfSite/:site', getAllWorkersOfSite)

// generate report of a worker of till date
router.put('/api/workers/generateReport/:id', generateReportOfWorker)

// generate report of a worker of specific date only
router.put('/api/workers/generateReportOfCrntMonth/:id/:date', generateReportOfWorkerOfCrntMonth)

// change rate of worker
router.put('/api/workers/changeRateOfWorker/:id', changeRateOfWorker)

// change rate of worker
router.put('/api/workers/changeRateOfWorkerWithoutHomeAdv/:id', generateReportOfWorkerWidthoutHomeAdv)

// getting home advance of worker
router.get('/api/workers/getHomeAdvanceOfWorker/:id', getHomeAdvance)

// checking if woker has to be generated report
router.get('/api/workers/checkWorkersReport/:date/:site', checkingIfWorker)

// getting all paid workers in any specific month
router.put('/api/workers/getAllPaidInSpecificMonth', getAllPaidInSpecificMonth)

// user det
router.get('/api/workers/getWorkerDet/:id', getSingleWorkerDet)

// marking worker as went home after paying
router.put('/api/workers/markWorkerAsWentAfterPaying/:id/:owner', changeActiveStatusOnPaying)

// mark worker home advance as 0
router.put('/api/workers/markWorkerHomeAdv/:id', markeWorkerHomeAdvance)

// mark worker as paid
router.put('/api/workers/markWorkerAsPaid/:id', markWorkerAsPaid)

module.exports = router;