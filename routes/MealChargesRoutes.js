const express = require('express');
const router = express.Router();
const {
    addNewMealCharge,
    getAllMealChargesOfDate,
    addNewMealChargeByManager
} = require('../controllers/MealChargesControllers')


// add new meal charge
router.post('/api/mealCharges/addNew' , addNewMealCharge)

// getting all meal charges of a workers of a specific date
router.get('/api/mealCharges/getAllMealCharges/:id/:site/:date', getAllMealChargesOfDate)

// add new meal charge by manager
router.post('/api/mealChargesByManager/addNew' , addNewMealChargeByManager)


module.exports = router;