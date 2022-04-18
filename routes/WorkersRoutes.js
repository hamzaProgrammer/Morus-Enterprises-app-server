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
    updateWorkerProfile
} = require('../controllers/WorkersController')
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

module.exports = router;