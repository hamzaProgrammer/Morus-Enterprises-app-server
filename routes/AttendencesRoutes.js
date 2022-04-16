const express = require('express');
const router = express.Router();
const {
    addNewAttendence,
    getAllAttendencesInDuration,
    getAllAttendencesOfYesterday,
    getAllAttendencesOfToday,
    addNewAttendenceByManager,
    getAllAttendencesOfYesterdayByManager,
    getAllAttendencesOfTodayByManager,
    markAllActiveWorkersAbsentAtNight
} = require('../controllers/AttendencesControllers')


// add new attendence
router.post('/api/attendences/addNew', addNewAttendence)

// getting all sites of an admin
router.get('/api/attendences/getPreviousAttendences/:id/:userDate/:site', getAllAttendencesInDuration)

// getting all attedences of workers all workers of yesterday
router.get('/api/sites/getAllWorkersTYesterdayAttendences/:owner/:site', getAllAttendencesOfYesterday)

// getting all attedences of workers all workers of today
router.get('/api/sites/getAllWorkersTYesterdayTodayAttendences/:owner/:site', getAllAttendencesOfToday)

// mark all active workers absent at night
router.put('/api/sites/markAllActiveWorkersAbsentAtNight', markAllActiveWorkersAbsentAtNight)



// Manager Routes

// add new  attendence
router.post('/api/attendences/addNewByManager', addNewAttendenceByManager)

// getting all attedences of workers all workers of yesterday
router.get('/api/sites/getAllWorkersTYesterdayAttendencesByManager/:manager/:site', getAllAttendencesOfYesterdayByManager)

// getting all attedences of workers all workers of today
router.get('/api/sites/getAllWorkersTYesterdayTodayAttendencesByManager/:manager/:site', getAllAttendencesOfTodayByManager)


module.exports = router;