const Workers = require('../models/WorkerSchema')
const Admins = require('../models/AdminSchema')
const Sites = require('../models/SitesSchema')
const Agents = require('../models/AgentsSchema')
const SiteAdvance = require('../models/SitesAdvancesSchema')
const MealCharges = require('../models/MealChargesSchema')
const Attendences = require('../models/AttendenceSchema')
const AgentRegister = require('../models/AgentExpenseRegister')
const URL = "https://morus-enterprises-server.herokuapp.com"

// add new worker
const addNewWorker = async (req, res) => {
    const { name , phoneNo , dateOfBirth , location , paymentType, salary , allowance , homeAdvance , date , accountNo , ifsc , owner , agent , site} = req.body;
    if (!name || !phoneNo || !dateOfBirth || !location || !paymentType || !salary || !allowance || !homeAdvance  || !accountNo || !ifsc || !owner || !date || !agent || !site ) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const cDate = new Date();
        const final = cDate.getFullYear() + "-" + (cDate.getMonth() + 1) + "-" + cDate.getDate();

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
        const newWorker = new Workers({...req.body})
        try {
            let newlyWorker = await newWorker.save();

            checkAgent.expenses += Number(homeAdvance);
            await Agents.findByIdAndUpdate(agent , {$set : {...checkAgent}} , {new : true})

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

            // creating new record for agent expenses record
            let agentReg = {
                worker : newlyWorker._id.toString(),
                agent: agent,
                amount : homeAdvance,
                date : newlyWorker.createdAt,
            }
            const newAgenReg = new AgentRegister({...agentReg});

            let agg = await newAgenReg.save();
            console.log("agg : ", agg)

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
    console.log("req.file : ", req.file.filename)

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
            checkWorker.profilePic = URL + "/siteAdvancePics/" +  req.file.filename.toLowerCase();
            console.log("checkWorker.profilePic : ", checkWorker.profilePic)
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
    const newGotDate = new Date()
    const finalDate = newGotDate.getFullYear() + "-" + (newGotDate.getMonth() + 1 ) + "-" + newGotDate.getDate();
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
                        // marjing worker attendence of today as true/active
                        const newGotDate = new Date();
                        let finalGotDate = newGotDate.getFullYear() + "-" + (newGotDate.getMonth() + 1) + "-" + newGotDate.getDate() ; // previous adate
                        check.activeStatus = true;
                        check.lastActive = finalDate;
                        check.lastActiveMonthYear = ""
                        check.lastActiveMonthYear = newGotDate.getFullYear() + "-" + (newGotDate.getMonth() + 1 )

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
        }, {_id : 1 , name : 1 , activeStatus : 1 , profilePic : 1 })
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
    const {amt , agentId , date} = req.body
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
            let getRec = await AgentRegister.findOne({ agent : agentId  , worker : id , date : {$eq : check.createdAt} } );
            console.log("getRec : ",getRec)
            if(!getRec){
                return res.status(201).json({
                    success: false,
                    message : "Agent Record Register Not Found"
                })
            }

            checkAgent.expenses += Number(amt);
            await Agents.findByIdAndUpdate(agentId , {$set : {...checkAgent}} , {new : true})
                try {
                    check.homeAdvance += Number(amt)
                    await Workers.findByIdAndUpdate(id , {$set : {...check}} , {new : true})

                    // updating agent record register
                    getRec.amount = amt;
                    await AgentRegister.findByIdAndUpdate(getRec._id , {$set : {...getRec}} , {new : true})

                    return res.status(201).json({
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

// report of worker or current date
const generateReportOfWorker = async (req, res) => {
    const {id} = req.params;
    const {travelAllownce} = req.body;

    let hourRate = 0;

    // got date
    const newGotDate = new Date();
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();

    // curent date
    let d = new Date();
    let finDate = 0

    if((newGotDate.getMonth() + 1) === 1 || (newGotDate.getMonth() + 1) === 3 || (newGotDate.getMonth() + 1) === 5 || (newGotDate.getMonth() + 1) === 7 || (newGotDate.getMonth() + 1) === 8 || (newGotDate.getMonth() + 1) === 10 ||  (newGotDate.getMonth() + 1) === 12 ){
        finDate = 31
    }else if((newGotDate.getMonth() + 1) === 2){
        finDate = 28
    }else{
        finDate = 30
    }

    if((d.getMonth() + 1) === (gotMonth + 1)){
        finDate = d.getDate();
    }
    // curent date
    let finalDate = gotYear + "-" + gotMonth  + "-" + finDate;
    let initialDate = gotYear + "-" + gotMonth  + "-" + 1;

    const dateArray = finalDate.split("-");


    if (!id) {
        return res.json({
            success: false,
            message: "Please Id of Worker"
        });
    } else {
        let checkWorker = await Workers.findById(id);
        if(!checkWorker){
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }else {
                try {
                    console.log("checkWorker.activeStatus: ", checkWorker.activeStatus)
                    if(checkWorker.activeStatus === false){
                        return res.json({
                            success: false,
                            message: 'This is Worker Is Not Currently Active At Any Site'
                        })
                    }

                    let grossWage = 0;
                    if(checkWorker.paymentType === "monthly"){
                        let oneDateRate = (checkWorker.salary / 30)
                        hourRate = (oneDateRate/8)
                    }else if(checkWorker.paymentType === "daily wage"){
                        let oneDateRate = (checkWorker.salary / 1)
                        hourRate =(oneDateRate/8)
                    }
                    console.log("hourRate : ", hourRate)

                    // calculating overtime
                    const allOverTime = await Attendences.find({date : {$gte : initialDate , $lte : finalDate} , worker : id});
                    let overTime = 0, noOfPresentDays = 0;
                    let lastOne = null, secRec = null;
                    for(let i = 0; i !== allOverTime.length; i++){
                        if(allOverTime[i].isPresent === true){
                            noOfPresentDays = noOfPresentDays + 1
                            secRec = allOverTime[0].date
                            lastOne = allOverTime[i].date;
                            overTime += Number(allOverTime[i].overTime * hourRate);
                            console.log("overTime : ", overTime, "allOverTime[i].overTime : ", allOverTime[i].overTime, "hourRate : ", hourRate)
                        }
                    }

                    console.log("grossWage : ", grossWage)

                    if(noOfPresentDays === 0){
                        noOfPresentDays = 1;
                    }

                    if(checkWorker.paymentType === "monthly"){
                        grossWage = (noOfPresentDays * (checkWorker.salary / 30))
                    }else if(checkWorker.paymentType === "daily wage"){
                        grossWage = (noOfPresentDays * checkWorker.salary);
                    }

                    console.log("noOfPresentDays : ",noOfPresentDays)

                    if(noOfPresentDays === 0){
                        return res.json({
                            success: false,
                            message: 'This Worker has no Active Days'
                        })
                    }

                    console.log("last attendence was made on : ", lastOne)

                    // calculating site advance
                    const allSiteAdvances = await SiteAdvance.find({date : {$gte :initialDate , $lte : finalDate} , worker : id});
                    let siteAdvance = 0;
                    for(let i = 0; i !== allSiteAdvances.length; i++){
                        siteAdvance += Number(allSiteAdvances[i].siteAdvance);
                    }

                    // calculating meal charges
                    const mealAllCharges = await MealCharges.find({date : {$gte : initialDate , $lte : finalDate} , worker : id});
                    let mealCharges = 0;
                    for(let i = 0; i !== mealAllCharges.length; i++){
                        mealCharges += Number(mealAllCharges[i].mealCharge);
                    }

                    const deductions = Number(checkWorker.homeAdvance) + Number(siteAdvance) + Number(mealCharges);

                    console.log("grossWage : ", grossWage , " deductions : ", deductions , " overTime : ", overTime );
                    let netWage = grossWage - (deductions);
                    netWage = Number(netWage) + Number(travelAllownce) + Number(overTime)
                    console.log("netWage : ",netWage)

                    // marking as went home now
                    checkWorker.lastPaidDate = finalDate;
                    //await Workers.findByIdAndUpdate(id, {$set : {...checkWorker}}, {new : true});

                    return res.status(201).json({
                        success: true,
                        Name : checkWorker.name,
                        Date : `${secRec} - to - ${lastOne}`,
                        PresentDays : noOfPresentDays,
                        OverTime : overTime,
                        HomeAdvance : checkWorker.homeAdvance,
                        Rate : checkWorker.salary,
                        GrossWage : grossWage,
                        Deductions : deductions,
                        Allowences : Number(travelAllownce)  + Number(overTime),
                        NetWage : netWage,
                    })
                } catch (error) {
                    console.log("Error in generateReportOfWorker and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// report of worker or current date without home advance
const generateReportOfWorkerWidthoutHomeAdv = async (req, res) => {
    const {id, date} = req.params;
    const {travelAllownce} = req.body;

    let hourRate = 0;

    // got date
    const newGotDate = new Date(date);
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();

    // curent date
    let d = new Date(date);
    let finDate = 0

    if((newGotDate.getMonth() + 1) === 1 || (newGotDate.getMonth() + 1) === 3 || (newGotDate.getMonth() + 1) === 5 || (newGotDate.getMonth() + 1) === 7 || (newGotDate.getMonth() + 1) === 8 || (newGotDate.getMonth() + 1) === 10 ||  (newGotDate.getMonth() + 1) === 12 ){
        finDate = 31
    }else if((newGotDate.getMonth() + 1) === 2){
        finDate = 28
    }else{
        finDate = 30
    }

    if((d.getMonth() + 1) === (gotMonth + 1)){
        finDate = d.getDate();
    }
    // curent date
    let finalDate = gotYear + "-" + gotMonth  + "-" + finDate;
    let initialDate = gotYear + "-" + gotMonth  + "-" + 1;

    const dateArray = finalDate.split("-");


    if (!id || !date) {
        return res.json({
            success: false,
            message: "Please Id of Worker"
        });
    } else {
        let checkWorker = await Workers.findById(id);
        if(!checkWorker){
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }else {
                try {
                    console.log("checkWorker.activeStatus: ", checkWorker.activeStatus)
                    if(checkWorker.activeStatus === false){
                        return res.json({
                            success: false,
                            message: 'This is Worker Is Not Currently Active At Any Site'
                        })
                    }

                    let grossWage = 0;
                    if(checkWorker.paymentType === "monthly"){
                        let oneDateRate = (checkWorker.salary / 30)
                        hourRate = (oneDateRate/8)
                    }else if(checkWorker.paymentType === "daily wage"){
                        let oneDateRate = (checkWorker.salary / 1)
                        hourRate =(oneDateRate/8)
                    }
                    console.log("hourRate : ", hourRate)

                    // calculating overtime
                    const allOverTime = await Attendences.find({date : {$gte : initialDate , $lte : finalDate} , worker : id});
                    let overTime = 0, noOfPresentDays = 0;
                    let lastOne = null, secRec = null;
                    for(let i = 0; i !== allOverTime.length; i++){
                        if(allOverTime[i].isPresent === true){
                            noOfPresentDays = noOfPresentDays + 1
                            secRec = allOverTime[0].date
                            lastOne = allOverTime[i].date;
                            overTime += Number(allOverTime[i].overTime * hourRate);
                            console.log("overTime : ", overTime, "allOverTime[i].overTime : ", allOverTime[i].overTime, "hourRate : ", hourRate)
                        }
                    }

                    console.log("grossWage : ", grossWage)

                    if(noOfPresentDays === 0){
                        noOfPresentDays = 1;
                    }

                    if(checkWorker.paymentType === "monthly"){
                        grossWage = (noOfPresentDays * (checkWorker.salary / 30))
                    }else if(checkWorker.paymentType === "daily wage"){
                        grossWage = (noOfPresentDays * checkWorker.salary);
                    }

                    console.log("noOfPresentDays : ",noOfPresentDays)

                    if(noOfPresentDays === 0){
                        return res.json({
                            success: false,
                            message: 'This Worker has no Active Days'
                        })
                    }

                    console.log("last attendence was made on : ", lastOne)

                    // calculating site advance
                    const allSiteAdvances = await SiteAdvance.find({date : {$gte :initialDate , $lte : finalDate} , worker : id});
                    let siteAdvance = 0;
                    for(let i = 0; i !== allSiteAdvances.length; i++){
                        siteAdvance += Number(allSiteAdvances[i].siteAdvance);
                    }

                    // calculating meal charges
                    const mealAllCharges = await MealCharges.find({date : {$gte : initialDate , $lte : finalDate} , worker : id});
                    let mealCharges = 0;
                    for(let i = 0; i !== mealAllCharges.length; i++){
                        mealCharges += Number(mealAllCharges[i].mealCharge);
                    }

                    const deductions =  siteAdvance + mealCharges;

                    let netWage = grossWage - (deductions);
                    netWage = Number(netWage) + Number(travelAllownce) + Number(overTime)

                    // marking as went home now
                    checkWorker.lastPaidDate = finalDate;
                    await Workers.findByIdAndUpdate(id, {$set : {...checkWorker}}, {new : true});

                    return res.status(201).json({
                        success: true,
                        Name : checkWorker.name,
                        Date : `${secRec} - to - ${lastOne}`,
                        PresentDays : noOfPresentDays,
                        OverTime : overTime,
                        Rate : checkWorker.salary,
                        GrossWage : grossWage,
                        Deductions : deductions,
                        Allowences : Number(travelAllownce)  + Number(overTime),
                        NetWage : netWage,
                    })
                } catch (error) {
                    console.log("Error in generateReportOfWorker and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }

}

// report of worker of current month
const generateReportOfWorkerOfCrntMonth = async (req, res) => {
    const {id, date} = req.params;

    let hourRate = 0;
    // got date
    const newGotDate = new Date(date);
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();

    // curent date
    let d = new Date(date);
    let finDate = 0

    if((newGotDate.getMonth() + 1) === 1 || (newGotDate.getMonth() + 1) === 3 || (newGotDate.getMonth() + 1) === 5 || (newGotDate.getMonth() + 1) === 7 || (newGotDate.getMonth() + 1) === 8 || (newGotDate.getMonth() + 1) === 10 ||  (newGotDate.getMonth() + 1) === 12 ){
        finDate = 31
    }else if((newGotDate.getMonth() + 1) === 2){
        finDate = 28
    }else{
        finDate = 30
    }

    if((d.getMonth() + 1) === (gotMonth + 1)){
        finDate = d.getDate();
    }
    // curent date
    let finalDate = gotYear + "-" + gotMonth  + "-" + finDate;
    let initialDate = gotYear + "-" + gotMonth  + "-" + 1;

    const dateArray = finalDate.split("-");


    //if (!id || !travelAllownce || !date) {
    if (!id) {
        return res.json({
            success: false,
            message: "Please Provide all Crededentials"
        });
    } else {
        let checkWorker = await Workers.findById(id);
        if(!checkWorker){
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }else {
                try {
                    console.log("checkWorker.activeStatus: ", checkWorker.activeStatus)
                    if(checkWorker.activeStatus === false){
                        return res.json({
                            success: false,
                            message: 'This is Worker Is Not Currently Active At Any Site'
                        })
                    }

                    let grossWage = 0;
                    if(checkWorker.paymentType === "monthly"){
                        let oneDateRate = (checkWorker.salary / 30)
                        hourRate = (oneDateRate/8)
                    }else if(checkWorker.paymentType === "daily wage"){
                        let oneDateRate = (checkWorker.salary / 1)
                        hourRate =(oneDateRate/8)
                    }
                    console.log("hourRate : ", hourRate)

                    // calculating overtime
                    const allOverTime = await Attendences.find({date : {$gte : initialDate , $lte : finalDate} , worker : id});
                    let overTime = 0, noOfPresentDays = 0;
                    let lastOne = null, secRec = null;
                    for(let i = 0; i !== allOverTime.length; i++){
                        if(allOverTime[i].isPresent === true){
                            noOfPresentDays = noOfPresentDays + 1
                            secRec = allOverTime[0].date
                            lastOne = allOverTime[i].date;
                            overTime += Number(allOverTime[i].overTime * hourRate);
                            console.log("overTime : ", overTime, "allOverTime[i].overTime : ", allOverTime[i].overTime, "hourRate : ", hourRate)
                        }
                    }

                    console.log("grossWage : ", grossWage)

                    if(noOfPresentDays === 0){
                        noOfPresentDays = 1;
                    }

                    if(checkWorker.paymentType === "monthly"){
                        grossWage = (noOfPresentDays * (checkWorker.salary / 30))
                    }else if(checkWorker.paymentType === "daily wage"){
                        grossWage = (noOfPresentDays * checkWorker.salary);
                    }

                    console.log("noOfPresentDays : ",noOfPresentDays)

                    if(noOfPresentDays === 0){
                        return res.json({
                            success: false,
                            message: 'This Worker has no Active Days'
                        })
                    }

                    console.log("last attendence was made on : ", lastOne)

                    // calculating site advance
                    const allSiteAdvances = await SiteAdvance.find({date : {$gte :initialDate , $lte : finalDate} , worker : id});
                    let siteAdvance = 0;
                    for(let i = 0; i !== allSiteAdvances.length; i++){
                        siteAdvance += Number(allSiteAdvances[i].siteAdvance);
                    }

                    // calculating meal charges
                    const mealAllCharges = await MealCharges.find({date : {$gte : initialDate , $lte : finalDate} , worker : id});
                    let mealCharges = 0;
                    for(let i = 0; i !== mealAllCharges.length; i++){
                        mealCharges += Number(mealAllCharges[i].mealCharge);
                    }

                    const deductions =  siteAdvance + mealCharges;

                    let netWage = grossWage - (deductions);
                    netWage = Number(netWage)  + Number(overTime)

                    // marking as went home now
                    checkWorker.lastPaidDate = finalDate;
                    await Workers.findByIdAndUpdate(id, {$set : {...checkWorker}}, {new : true});

                    return res.status(201).json({
                        success: true,
                        Name : checkWorker.name,
                        Date : `${initialDate} - to - ${finalDate}`,
                        PresentDays : noOfPresentDays,
                        OverTime : overTime,
                        Rate : checkWorker.salary,
                        GrossWage : grossWage,
                        Deductions : deductions,
                        Allowences : overTime,
                        NetWage : netWage,
                    })

                } catch (error) {
                    console.log("Error in generateReportOfWorkerOfCrntMonth and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// report of worker of current month with home advance
const generateReportOfWorkerOfCrntMonthWithAdvance = async (req, res) => {
    const {id, date} = req.params;

    let hourRate = 0;
    // got date
    const newGotDate = new Date(date);
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();

    // curent date
    let d = new Date(date);
    let finDate = 0

    if((newGotDate.getMonth() + 1) === 1 || (newGotDate.getMonth() + 1) === 3 || (newGotDate.getMonth() + 1) === 5 || (newGotDate.getMonth() + 1) === 7 || (newGotDate.getMonth() + 1) === 8 || (newGotDate.getMonth() + 1) === 10 ||  (newGotDate.getMonth() + 1) === 12 ){
        finDate = 31
    }else if((newGotDate.getMonth() + 1) === 2){
        finDate = 28
    }else{
        finDate = 30
    }

    if((d.getMonth() + 1) === (gotMonth + 1)){
        finDate = d.getDate();
    }
    // curent date
    let finalDate = gotYear + "-" + gotMonth  + "-" + finDate;
    let initialDate = gotYear + "-" + gotMonth  + "-" + 1;

    const dateArray = finalDate.split("-");

    if (!id) {
        return res.json({
            success: false,
            message: "Please Provide all Crededentials"
        });
    } else {
        let checkWorker = await Workers.findById(id);
        if(!checkWorker){
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }else {
                try {
                    console.log("checkWorker.activeStatus: ", checkWorker.activeStatus)
                    if(checkWorker.activeStatus === false){
                        return res.json({
                            success: false,
                            message: 'This is Worker Is Not Currently Active At Any Site'
                        })
                    }

                    let grossWage = 0;
                    if(checkWorker.paymentType === "monthly"){
                        let oneDateRate = (checkWorker.salary / 30)
                        hourRate = (oneDateRate/8)
                    }else if(checkWorker.paymentType === "daily wage"){
                        let oneDateRate = (checkWorker.salary / 1)
                        hourRate =(oneDateRate/8)
                    }
                    console.log("hourRate : ", hourRate)

                    // calculating overtime
                    const allOverTime = await Attendences.find({date : {$gte : initialDate , $lte : finalDate} , worker : id});
                    let overTime = 0, noOfPresentDays = 0;
                    let lastOne = null, secRec = null;
                    for(let i = 0; i !== allOverTime.length; i++){
                        if(allOverTime[i].isPresent === true){
                            noOfPresentDays = noOfPresentDays + 1
                            secRec = allOverTime[0].date
                            lastOne = allOverTime[i].date;
                            overTime += Number(allOverTime[i].overTime * hourRate);
                            console.log("overTime : ", overTime, "allOverTime[i].overTime : ", allOverTime[i].overTime, "hourRate : ", hourRate)
                        }
                    }

                    console.log("grossWage : ", grossWage)

                    if(noOfPresentDays === 0){
                        noOfPresentDays = 1;
                    }

                    if(checkWorker.paymentType === "monthly"){
                        grossWage = (noOfPresentDays * (checkWorker.salary / 30))
                    }else if(checkWorker.paymentType === "daily wage"){
                        grossWage = (noOfPresentDays * checkWorker.salary);
                    }

                    console.log("noOfPresentDays : ",noOfPresentDays)

                    if(noOfPresentDays === 0){
                        return res.json({
                            success: false,
                            message: 'This Worker has no Active Days'
                        })
                    }

                    console.log("last attendence was made on : ", lastOne)

                    // calculating site advance
                    const allSiteAdvances = await SiteAdvance.find({date : {$gte :initialDate , $lte : finalDate} , worker : id});
                    let siteAdvance = 0;
                    for(let i = 0; i !== allSiteAdvances.length; i++){
                        siteAdvance += Number(allSiteAdvances[i].siteAdvance);
                    }

                    // calculating meal charges
                    const mealAllCharges = await MealCharges.find({date : {$gte : initialDate , $lte : finalDate} , worker : id});
                    let mealCharges = 0;
                    for(let i = 0; i !== mealAllCharges.length; i++){
                        mealCharges += Number(mealAllCharges[i].mealCharge);
                    }

                    const deductions =  siteAdvance + mealCharges;

                    let netWage = Number(grossWage) - (deductions) + Number(checkWorker.homeAdvance) ;
                    netWage = Number(netWage)  + Number(overTime)

                    // marking as went home now
                    checkWorker.lastPaidDate = finalDate;
                    await Workers.findByIdAndUpdate(id, {$set : {...checkWorker}}, {new : true});

                    return res.status(201).json({
                        success: true,
                        Name : checkWorker.name,
                        Date : `${initialDate} - to - ${finalDate}`,
                        PresentDays : noOfPresentDays,
                        HomeAdvance : checkWorker.homeAdvance,
                        OverTime : overTime,
                        Rate : checkWorker.salary,
                        GrossWage : grossWage,
                        Deductions : deductions,
                        Allowences : overTime,
                        NetWage : netWage,
                    })

                } catch (error) {
                    console.log("Error in generateReportOfWorkerOfCrntMonth and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// change rate  of worker
const changeRateOfWorker = async (req, res) => {
    const {id} = req.params;
    const {rate} = req.body;
    if (!id || !rate) {
        return res.json({
            success: false,
            message: "Please Provide All Credentials"
        });
    } else {
        let checkWorker = await Workers.findById(id);
        if(!checkWorker){
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }else {
                try {
                    // changing rate
                    checkWorker.salary = rate;
                    await Workers.findByIdAndUpdate(id, {$set : {...checkWorker}}, {new : true});

                    res.status(201).json({
                        success: true,
                        message : "WorkerRate of Work Changed SuccessFully"
                    })
                } catch (error) {
                    console.log("Error in changeRateOfWorker and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting home advance  of worker
const getHomeAdvance = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.json({
            success: false,
            message: "Please Provide All Credentials"
        });
    } else {
        let checkWorker = await Workers.findById(id);
        if(!checkWorker){
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }else {
                try {
                    res.status(201).json({
                        success: true,
                        HomeAdvance : checkWorker.homeAdvance
                    })
                } catch (error) {
                    console.log("Error in getHomeAdvance and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// checking if worker is paid or not
const checkingIfWorker = async (req, res) => {
    const { date, site} = req.params;

    if (!date) {
        return res.json({
            success: false,
            message: "Please Provide All Credentials"
        });
    } else {
        let checkWorker = await Workers.find({lastActiveMonthYear : date, site : site });
        if(checkWorker.length < 1){
            return res.json({
                success: false,
                message: 'No Workers Found'
            })
        }else {
                try {
                    res.status(201).json({
                        success: true,
                        AllWorkers : checkWorker
                    })
                } catch (error) {
                    console.log("Error in checkingIfWorker and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// geting all months paid in any specific month
const getAllPaidInSpecificMonth = async (req, res) => {
    const {initDate, finalDate, site} = req.body;

    if (!initDate || !finalDate) {
        return res.json({
            success: false,
            message: "Please Provide all Crededentials"
        });
    } else {
        let isExists = await Workers.find({lastPaidDate : {$gte : initDate , $lte : finalDate, site : site }})
        try {
            return res.status(201).json({
                success: true,
                AllPaidWorkers : isExists
            })
        } catch (error) {
            console.log("Error in getAllPaidInSpecificMonth and error is : ", error)
            res.status(201).json({
                success: false,
                error : "Could Not Perform Action"
            })
        }
    }
}

// get single woeker details
const getSingleWorkerDet = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.json({
            success: false,
            message: "Id of Worker is Required"
        });
    } else {
        const checkAdmin = await Workers.findById(id);
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }else {
                try {
                    res.status(201).json({
                        success: true,
                        WorkerImage : checkAdmin.profilePic,
                        WorkerName : checkAdmin.name,
                        WorkerRate : checkAdmin.salary,
                        WorkerSalaryType : checkAdmin.paymentType,
                        WorkerHomeAdvance : checkAdmin.homeAdvance,
                    })
                } catch (error) {
                    console.log("Error in getSingleWorkerDet and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// changing active status on paying the worker
const changeActiveStatusOnPaying = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.json({
            success: false,
            message: "Id of Worker is Required"
        });
    } else {
        let check = await Workers.findById(id)
        if (!check) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        } else {
                try {
                    check.activeStatus = false

                    await Workers.findByIdAndUpdate(id , {$set : {...check}} , {new : true})
                    res.status(201).json({
                        success: true,
                        message : "Worker Active Status Changed SuccessFully"
                    })

                } catch (error) {
                    console.log("Error in changeActiveStatusOnPaying and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// marking worker as paid
const markWorkerAsPaid = async (req, res) => {
    const {id} = req.params;
    const cDate = new Date();
    const final = cDate.getFullYear() + "-" + (cDate.getMonth() + 1) + "-" + cDate.getDate();

    if (!id) {
        return res.json({
            success: false,
            message: "Id of Worker is Required"
        });
    } else {
        let check = await Workers.findById(id)
        if (!check) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        } else {
                try {
                    check.isPaid = true;
                    check.paidOn = final;

                    await Workers.findByIdAndUpdate(id , {$set : {...check}} , {new : true})
                    res.status(201).json({
                        success: true,
                        message : "Worker Active Status Changed SuccessFully"
                    })

                } catch (error) {
                    console.log("Error in markWorkerAsPaid and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// mark worker as paid
const markeWorkerHomeAdvance = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.json({
            success: false,
            message: "Id of Worker is Required"
        });
    } else {
        let check = await Workers.findById(id)
        if (!check) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        } else {
                try {
                    check.homeAdvance = 0

                    await Workers.findByIdAndUpdate(id , {$set : {...check}} , {new : true})
                    res.status(201).json({
                        success: true,
                        message : "Worker Home Advance is Set to 0 (Zero) SuccessFully"
                    })

                } catch (error) {
                    console.log("Error in markeWorkerHomeAdvance and error is : ", error)
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
    markWorkerAsPaid,
    generateReportOfWorkerOfCrntMonthWithAdvance
}