const Agents = require('../models/AgentsSchema')
const Admins = require('../models/AdminSchema')
const Workers = require('../models/WorkerSchema')
const Sites = require('../models/SitesSchema')
const AgentRegister = require('../models/AgentExpenseRegister')
const mongoose = require("mongoose")



// add new agent
const addNewAgent = async (req, res) => {
    const {name, phoneNo , owner} = req.body;

    if (!name || !phoneNo || !owner) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Admins.findById(owner);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Admin Not Found'
            })
        }

        const check = await Agents.findOne({phoneNo : phoneNo})
        if (check) {
            return res.json({
                success: false,
                message: 'Agent Already Exists with same Phone No.'
            })
        }else {
            const newAgent = new Agents({...req.body})
            try {
                await newAgent.save();

                res.status(201).json({
                    success: true,
                    message: 'New Agent SuccessFully Added'
                })
            } catch (error) {
                console.log("Error in addNewAgent and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// getting single agent payment history
const getSingleSite = async (req, res) => {
    const {id,owner} = req.params;
    if (!id ||!owner) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Admins.findById(owner);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Admin Not Found'
            })
        }
        const check = await Agents.findOne({
            _id : id , owner : owner
        }, {name : 1 , cashGiven : 1 , balance : 1 , expenses : 1  })
        if (!check) {
            return res.json({
                success: false,
                message: 'Agent Not Found'
            })
        } else {
                let balance = check.cashGiven - check.expenses;
                const AllExpenses = await AgentRegister.aggregate([
                    {
                        $match : {
                            agent: mongoose.Types.ObjectId(id),
                        },
                    },
                    {
                        $lookup: {
                            from: 'moruenterprisesworkers',
                            localField: 'worker',
                            foreignField: '_id',
                            as: 'worker'
                        },
                    },
                    {
                        $unwind: "$worker"
                    },
                    {
                        $project: {
                                WorkerName : "$worker.name",
                                Amount : "$amount",
                                Date : "$createdAt"
                            },
                    }
                ])
                try {
                    return res.status(201).json({
                        success: true,
                        CashGiven : check.cashGiven,
                        Expenses : check.expenses,
                        Balance : balance,
                        Name : check.name,
                        AllExpenses : AllExpenses
                    })
                } catch (error) {
                    console.log("Error in getSingleSite and error is : ", error)
                    return res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// adding cash to agent account
const addCashToAgent = async (req, res) => {
    const {id,owner} = req.params;
    const {amount} = req.body
    if (!id ||!owner) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Admins.findById(owner);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Admin Not Found'
            })
        }
        let check = await Agents.findOne({
            _id : id , owner : owner
        })
        if (!check) {
            return res.json({
                success: false,
                message: 'Agent Not Found'
            })
        } else {
                try {
                    check.cashGiven += Number(amount);
                    await Agents.findByIdAndUpdate(id , {$set : {...check}} , {new : true})

                    res.status(201).json({
                        success: true,
                        message : "Cash SuccessFully Added",
                    })
                } catch (error) {
                    console.log("Error in addCashToAgent and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all cashiers of single agent
const getAllWorkersOfSingleAgent = async (req, res) => {
    const {id,owner} = req.params;
    if (!id ||!owner) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Admins.findById(owner);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Admin Not Found'
            })
        }
        let check = await Workers.find({
            agent : id
        } , {name : 1 , date:  1 , salary : 1 , _id : 0})
        if (!check) {
            return res.json({
                success: false,
                message: 'Workers Not Found'
            })
        } else {
                try {
                    res.status(201).json({
                        success: true,
                        AllWorkers : check,
                    })
                } catch (error) {
                    console.log("Error in getAllWorkersOfSingleAgent and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all agents of single site
const getAllAgentsOfSite = async (req, res) => {
    const {owner} = req.params;
    if (!owner) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Admins.findById(owner);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Admin Not Found'
            })
        }
        let check = await Agents.find({owner : owner } , {name : 1 , date :  1 , salary : 1 , _id : 1})
        if (!check) {
            return res.json({
                success: false,
                message: 'No Agents Found'
            })
        } else {
            console.log("check : ", check)
                try {
                    res.status(201).json({
                        success: true,
                        AllWorkers : check,
                    })
                } catch (error) {
                    console.log("Error in getAllAgentsOfSite and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}


module.exports = {
    addNewAgent,
    getSingleSite,
    addCashToAgent,
    getAllWorkersOfSingleAgent,
    getAllAgentsOfSite
}