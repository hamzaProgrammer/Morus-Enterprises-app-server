const express = require('express');
const router = express.Router();
const {
    addNewAgent,
    getSingleSite,
    addCashToAgent,
    getAllWorkersOfSingleAgent,
    getAllAgentsOfSite
} = require('../controllers/AgentsControllers')


// add new agent
router.post('/api/agents/addNew' , addNewAgent)

// getting account history of any single agent
router.get('/api/agents/getSingleAgentHistory/:id/:owner', getSingleSite)

// adding cash to agent
router.put('/api/agents/addCashToAgent/:id/:owner', addCashToAgent)

// getting workers of any agent
router.get('/api/agents/getAllWorkersOfAgent/:id/:owner', getAllWorkersOfSingleAgent)

// getting all agents
router.get('/api/agents/getAllAgents/:owner', getAllAgentsOfSite)

module.exports = router;