const express = require('express');
const router = express.Router();
const {
    addNewManager,
    LogInUser
} = require('../controllers/ManagerController')


// Sign Up manager
router.post('/api/managers/addNew', addNewManager)

// Sign In manager
router.post('/api/managers/signIn', LogInUser)

module.exports = router;