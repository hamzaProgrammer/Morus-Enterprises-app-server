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
    getAllWorkersOfSite
} = require('../controllers/WorkersController')


// Sign Up worker
router.post('/api/workers/addNew', addNewWorker)

// getting all workers of an admin
router.get('/api/workers/getAllWorkersOfAdmin/:site', getAllWorkers)

// getting single worker of an admin
router.get('/api/workers/getSingleWorkerOfAdmin/:id/:site', getSingleWorker)

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