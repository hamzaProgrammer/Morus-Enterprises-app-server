const Workers = require('../models/WorkerSchema')
const Admins = require('../models/AdminSchema')
const Sites = require('../models/SitesSchema')
const Agents = require('../models/AgentsSchema')
const Attendences = require('../models/AttendenceSchema')
const URL = "http://localhost:8080"
 



// add new worker
const addNewWorker = async (req, res) => {
    const { name , phoneNo , dateOfBirth , location , paymentType, salary , allowance , homeAdvance , date , accountNo , ifsc , owner , agent , site} = req.body;
    if (!name || !phoneNo || !dateOfBirth || !location || !paymentType || !salary || !allowance || !homeAdvance  || !accountNo || !ifsc || !owner || !date || !agent || !site ) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkSite = await Sites.findById(site);
        if(!checkSite){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        // checking agent
        let checkAgent = await Agents.findById(agent);
        if(!checkAgent){
            return res.json({
                success: false,
                message: 'Agent Not Found'
            })
        }

        const checkAdmin = await Admins.findById(owner);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Admin Not Found'
            })
        }
        const check = await Workers.find({
            name: name , owner : owner
        })
        if (check.length > 0) {
            return res.json({
                success: false,
                message: 'Worker Already Exists'
            })
        } else {
                const newWorker = new Workers({...req.body})
                try {
                    let newlyWorker = await newWorker.save();

                    checkAgent.expenses += Number(homeAdvance);
                    let newAgent = await Agents.findByIdAndUpdate(agent , {$set : {...checkAgent}} , {new : true})

                    //  marking worker's attendence
                    // got date
                    const newGotDate = new Date()
                    const finalDate = newGotDate.getFullYear() + "-" + (newGotDate.getMonth() + 1 ) + "-" + newGotDate.getDate();
                    let myBody = {
                        isPresent : false ,
                        date : finalDate ,
                        worker : newlyWorker._id ,
                        owner : owner,
                        overTime : 0,
                        site : site
                    };
                    const newAttences = new Attendences({...myBody});

                    let ww = await newAttences.save();
                    console.log("ww : ", ww)

                    res.status(201).json({
                        success: true,
                        message: 'New Worker SuccessFully Added and Also Marked his/her Attendence Absent Successlly'
                    })
                } catch (error) {
                    console.log("Error in addNewWorker and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all workers of an admin
const getAllWorkers = async (req, res) => {
    const {site} = req.params;
    if (!site) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Sites.findById(site);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }
        const check = await Workers.find({site : site}, {_id : 1 , name : 1  })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'This Site has No Workers'
            })
        } else {
                try {
                    res.status(201).json({
                        success: true,
                        WorkersData : check,
                    })
                } catch (error) {
                    console.log("Error in getAllWorkers and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting single worker of an admin
const getSingleWorker = async (req, res) => {
    const {id,site} = req.params;
    if (!id ||!site) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Sites.findById(site);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }
        const check = await Workers.find({
            _id : id , site : site
        }, {createdAt : 0 , updatedAt : 0 , __v :0 })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        } else {
                try {
                    res.status(201).json({
                        success: true,
                        WokerData : check,
                    })
                } catch (error) {
                    console.log("Error in getSingleWorker and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting single worker of an admin
const getWorkerPic = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const check = await Workers.findById(id)
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        } else {
                try {
                    res.status(201).json({
                        success: true,
                        ProfileImage : check.profilePic,
                    })
                } catch (error) {
                    console.log("Error in getWorkerPic and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// update worker
const updateWorkerPic = async (req, res) => {
    const {id} = req.params;

    if(!req.file){
        return res.json({
            success: false,
            message: "User Photo not Found "
        });
    }

    if ((req.file.mimetype  !== "image/jpeg" && req.file.mimetype  !== "image/jpg" && req.file.mimetype  !== "image/webP" && req.file.mimetype  !== "image/png")) {
        return res.json({
            success: false,
            message: "Only Image File Type is Supported"
        });
    }

    if (!id) {
        return res.json({
            success: false,
            message: "Id of Worker is Required"
        });
    } else {
        let checkWorker = await Workers.findById(id);
        if(!checkWorker){
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }
        try {
            checkWorker.profilePic = "";
            checkWorker.profilePic = URL + "/siteAdvancePics/" + req.file.filename.toLowerCase();
            await Workers.findByIdAndUpdate(checkWorker._id , {$set : {...checkWorker} }, {$new : true})

            res.status(201).json({
                success: true,
                message: 'Worker Profile Picture SuccessFully Updated'
            })
        } catch (error) {
            console.log("Error in updateWorkerPic and error is : ", error)
            res.status(201).json({
                success: false,
                error : "Could Not Perform Action"
            })
        }
    }
}

// update worker info
const updateWorkerProfile = async (req, res) => {
    const {id} = req.params;

    if(Object.keys(req.body).length === 0){
        return res.json({
            success: false,
            message: "No data Sent for Updating"
        });
    }

    if (!id) {
        return res.json({
            success: false,
            message: "Id of Worker is Required"
        });
    } else {
        let checkWorker = await Workers.findById(id);
        if(!checkWorker){
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }
        try {
            if(req.body.name){
                checkWorker.name = req.body.name
            }
            if(req.body.phoneNo ){
                checkWorker.phoneNo  = req.body.phoneNo
            }
            if(req.body.dateOfBirth  ){
                checkWorker.dateOfBirth   = req.body.dateOfBirth
            }
            if(req.body.location   ){
                checkWorker.location    = req.body.location
            }
            if(req.body.paymnetType    ){
                checkWorker.paymnetType     = req.body.paymnetType
            }
            if(req.body.salary){
                checkWorker.salary = req.body.salary
            }
            if(req.body.allowence){
                checkWorker.allowence = req.body.allowence
            }
            if(req.body.homeAdvace){
                checkWorker.homeAdvace = req.body.homeAdvace
            }
            if(req.body.date){
                checkWorker.date = req.body.date
            }
            if(req.body.accountNo){
                checkWorker.accountNo = req.body.accountNo
            }
            if(req.body.ifsc){
                checkWorker.ifsc = req.body.ifsc
            }
            if(req.body.owner ){
                checkWorker.owner  = req.body.owner
            }
            if(req.body.agent ){
                checkWorker.agent  = req.body.agent
            }
            if(req.body.site ){
                checkWorker.site  = req.body.site
            }

            await Workers.findByIdAndUpdate(checkWorker._id , {$set : {...checkWorker} }, {$new : true})

            res.status(201).json({
                success: true,
                message: 'Worker Profile Info SuccessFully Updated'
            })
        } catch (error) {
            console.log("Error in updateWorkerProfile and error is : ", error)
            res.status(201).json({
                success: false,
                error : "Could Not Perform Action"
            })
        }
    }
}

// chnaging active status of single worker
const changeActiveStatus = async (req, res) => {
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
        let check = await Workers.findOne({
            _id : id , owner : owner
        })
        if (!check) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        } else {
                try {
                    console.log("check.activeStatus : ",check.activeStatus)
                    if(check.activeStatus === true){
                        check.activeStatus = false;
                    }else{
                        check.activeStatus = true;

                        // marjing worker attendence of today as true/active
                        const newGotDate = new Date();
                        let finalGotDate = newGotDate.getFullYear() + "-" + (newGotDate.getMonth() + 1) + "-" + newGotDate.getDate() ; // previous adate
                        let newBody = {
                            isPresent : true,
                            date : finalGotDate,
                            worker : id,
                            owner : owner,
                            overTime : 0,
                            site : check.site
                        }
                        const newAttences = new Attendences({...newBody});
                        await newAttences.save();
                    }
                    console.log("check : ", check)
                    await Workers.findByIdAndUpdate(id , {$set : {...check}} , {new : true})
                    res.status(201).json({
                        success: true,
                    })
                } catch (error) {
                    console.log("Error in changeActiveStatus and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all active workers of an admin
const getAllActiveWorkers = async (req, res) => {
    const {site} = req.params;
    if (!site) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Sites.findById(site);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }
        const check = await Workers.find({
            site : site , activeStatus : true
        }, {_id : 1 , name : 1 , activeStatus : 1  })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'Nio Active Workers found on this Site'
            })
        } else {
                try {
                    res.status(201).json({
                        success: true,
                        ActiveWorkers : check,
                    })
                } catch (error) {
                    console.log("Error in getAllActiveWorkers and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all went home workers of an admin
const getAllOfflineWorkers = async (req, res) => {
    const {site} = req.params;
    if (!site) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Sites.findById(site);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }
        const check = await Workers.find({
            site : site , activeStatus : false
        }, {_id : 1 , name : 1  , activeStatus : 1 })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'Workers Not Found'
            })
        } else {
                try {
                    res.status(201).json({
                        success: true,
                        ActiveWorkers : check,
                    })
                } catch (error) {
                    console.log("Error in getAllOfflineWorkers and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// adding details of single worker
const addDetailsOfWorker = async (req, res) => {
    const {id,site} = req.params;
    const {amt , agentId} = req.body
    if (!id ||!site) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Sites.findById(site);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        let checkAgent = await Agents.findById(agentId);
        if(!checkAgent){
            return res.json({
                success: false,
                message: 'Agent Not Found'
            })
        }

        
        let check = await Workers.findOne({
            _id : id , site : site
        })
        if (!check) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        } else {
            checkAgent.expenses += Number(amt);
            await Agents.findByIdAndUpdate(agentId , {$set : {...checkAgent}} , {new : true})
                try {
                    check.homeAdvance += Number(amt)
                    await Workers.findByIdAndUpdate(id , {$set : {...check}} , {new : true})
                    res.status(201).json({
                        success: true,
                        message : "Amount Added SuccessFully"
                    })
                } catch (error) {
                    console.log("Error in addDetailsOfWorker and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all workers of a site
const getAllWorkersOfSite = async (req, res) => {
    const {site} = req.params;
    if (!site) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Sites.findById(site);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }
        const check = await Workers.find({
            site : site
        }, {_id : 1 , name : 1  })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'No Workers found in this Site'
            })
        } else {
                try {
                    res.status(201).json({
                        success: true,
                        ActiveWorkers : check,
                    })
                } catch (error) {
                    console.log("Error in getAllWorkersOfSite and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

module.exports = {
    addNewWorker,
    getAllWorkers,
    getSingleWorker,
    changeActiveStatus,
    getAllActiveWorkers,
    getAllOfflineWorkers,
    addDetailsOfWorker,
    getAllWorkersOfSite,
    getWorkerPic,
    updateWorkerPic,
    updateWorkerProfile
}