const Workers = require('../models/WorkerSchema')
const Attendences = require('../models/AttendenceSchema')
const Admins = require('../models/AdminSchema')
const Managers = require('../models/ManagerSchema')
const Sites = require('../models/SitesSchema')
const cron = require('node-cron');
const mongoose = require("mongoose")

 
// add new worker
const addNewAttendence = async (req, res) => {
    const { isPresent , date , worker , owner, overTime , site} = req.body;
    if (!isPresent || !date || !worker || !owner || !overTime  || !site) {
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

        const checkSite = await Sites.findById(site);
        if(!checkSite){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        const check = await Workers.findById(worker)
        if (!check) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }
        let checkAttendence = await Attendences.findOne({date : date , worker : worker})
        if (checkAttendence) {
            checkAttendence.isPresent = isPresent
            checkAttendence.overTime = overTime
            await Attendences.findByIdAndUpdate(checkAttendence._id , {$set : {...checkAttendence} }, {$new : true})
            res.status(201).json({
                success: true,
                message: 'Worker Attendence Status Changed'
            })
        }else {
                req.body.site = site
                const newAttences = new Attendences({...req.body})
                try {
                    await newAttences.save();

                    res.status(201).json({
                        success: true,
                        message: 'New Worker Attendence SuccessFully Added'
                    })
                } catch (error) {
                    console.log("Error in addNewAttendence and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all attendces date wise
const getAllAttendencesInDuration = async (req, res) => {
    const {id , userDate , site } = req.params;

    const checkSite = await Sites.findById(site);
    if(!checkSite){
        return res.json({
            success: false,
            message: 'Site Not Found'
        })
    }

    const checkWorker = await Workers.findById(id);
    if(!checkWorker){
        return res.json({
            success: false,
            message: 'Worker Not Found'
        })
    }

    // got date
    const newGotDate = new Date(userDate)
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();


    if (newGotDate.getMonth() === 0){
        newGotDate.setMonth(11)
        newGotDate.setFullYear(newGotDate.getFullYear() - 1);
        gotYear = newGotDate.getFullYear();
        gotMonth = newGotDate.getMonth()
    }else{
        console.log("Inner inner")
        newGotDate.setMonth(newGotDate.getMonth())
        gotMonth = newGotDate.getMonth()
    }

    
    let finalGotDate = newGotDate.getFullYear() + "-" + newGotDate.getMonth() + "-" + newGotDate.getDate() ; // previous adate
    console.log("User Date ", userDate , " crnt date : ",finalGotDate )
    let message = `Record shown is from  ${finalGotDate} to ${userDate} and having difference of 7 Days.`;

    let allAttendences = {};

    try {
        allAttendences = await Attendences.aggregate([
            {
                $match : {
                    worker: mongoose.Types.ObjectId(id),
                    site : mongoose.Types.ObjectId(site),
                    date: {
                        $lte: userDate
                    },
                    date: {
                        $gte: finalGotDate,
                    },
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
                    _id: {
                        Att_Id : "$_id",
                        Att_Date : "$date",
                        Att_Present : "$isPresent",
                        Att_OverTime : "$overTime",
                        WokerName: "$worker.name",
                        WokerId: "$worker._id",
                    },
                }
            },
            {
                $group: {
                    _id: {
                        Att_Id: "$_id.Att_Id",
                        Att_Date: "$_id.Att_Date",
                        Att_Present: "$_id.Att_Present",
                        Att_OverTime: "$_id.Att_OverTime",
                        WokerName: "$_id.WokerName",
                        WokerId: "$_id.WokerId",
                    },
                }
            }
        ])

        if(allAttendences.length < 1){
            return res.json({
                message : "No Attendences  Found" ,
                success: false,
            });
        }

            return res.json({
            AllAttendences :allAttendences ,
            message,
            success: true,
        });
    } catch (error) {
        console.log("Error in getAllAttendencesInDuration and error is : ", error)
        return res.json({
            error : "Could Not Perform Action",
            success: true,
        });
    }
}

// getting all of yesterday attendces date wise
const getAllAttendencesOfYesterday = async (req, res) => {
    const {owner , site} = req.params;

    const checkSite = await Sites.findById(site);
    if(!checkSite){
        return res.json({
            success: false,
            message: 'Site Not Found'
        })
    }

    const newGotDate = new Date()
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();
    let gotDay = newGotDate.getDate();

    let diff = 0;
    let newDiff = 0;
    diff = gotDay - 1;
    newDiff = diff;
    if (diff < 0) {
        diff = -diff;
        //  checking last date of month to subtract
        if (gotMonth === 0 || gotMonth === 2 || gotMonth === 4 || gotMonth === 6 || gotMonth === 7 || gotMonth === 9 || gotMonth === 11) {
            newDiff = 31 - diff;
        }
        if (gotMonth === 3 || gotMonth === 5 || gotMonth === 8 || gotMonth === 10 ) {
            newDiff = 30 - diff;
        }
        if (gotMonth === 1) {
            newDiff = 28 - diff;
        }

        if (newGotDate.getMonth() === 0){
            newGotDate.setMonth(11)
            newGotDate.setFullYear(newGotDate.getFullYear() - 1);
            gotYear = newGotDate.getFullYear();
            gotMonth = newGotDate.getMonth()
        }else{
            console.log("Inner inner")
            newGotDate.setMonth(newGotDate.getMonth())
            gotMonth = newGotDate.getMonth()
        }
    }
    newGotDate.setDate(newDiff)
    let finalGotDate = gotYear + "-" + gotMonth + "-" + ( newDiff ) ; // previous adate

    try {
        const checkAdmin = await Admins.findById(owner);
        if(!checkAdmin) {
            return res.json({
                error : "Admin Not Found",
                success: false,
            });
        }

        const allAttendences = await Attendences.aggregate([
            {
                $match : {
                    date:  finalGotDate,
                    site:  mongoose.Types.ObjectId(site)
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
                    _id: {
                        Att_Id : "$_id",
                        Att_Date : "$date",
                        Att_Present : "$isPresent",
                        Att_OverTime : "$overTime",
                        WokerName: "$worker.name",
                        WokerId: "$worker._id",
                    },
                }
            },
            {
                $group: {
                    _id: {
                        Att_Id: "$_id.Att_Id",
                        Att_Date: "$_id.Att_Date",
                        Att_Present: "$_id.Att_Present",
                        Att_OverTime: "$_id.Att_OverTime",
                        WokerName: "$_id.WokerName",
                        WokerId: "$_id.WokerId",
                    },
                }
            }
        ])

        if(allAttendences.length < 1){
            return res.json({
                message : "No Attendences  Found" ,
                success: false,
            });
        }

            return res.json({
                AllAttendences :allAttendences ,
                success: true,
            });
    } catch (error) {
        console.log("Error in getAllAttendencesOfYesterday and error is : ", error)
        return res.json({
            error : "Could Not Perform Action",
            success: true,
        });
    }
}

// getting all of today's attendces date wise
const getAllAttendencesOfToday = async (req, res) => {
    const {owner , site} = req.params;

    const checkSite = await Sites.findById(site);
    if(!checkSite){
        return res.json({
            success: false,
            message: 'Site Not Found'
        })
    }

    const checkAdmin = await Admins.findById(owner);
    if(!checkAdmin){
        return res.json({
            success: false,
            message: 'Admin Not Found'
        })
    }


    const newGotDate = new Date()
    let finalGotDate = newGotDate.getFullYear() + "-" + (newGotDate.getMonth() + 1) + "-" + newGotDate.getDate();
    try {
        console.log("finalGotDate : ",finalGotDate)

        const allAttendences = await Attendences.aggregate([
            {
                $match : {
                    date:  finalGotDate,
                    site:  mongoose.Types.ObjectId(site),
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
                    workerData: {
                        Att_Id : "$_id",
                        Att_Date : "$date",
                        Att_Present : "$isPresent",
                        Att_OverTime : "$overTime",
                        WokerName: "$worker.name",
                        WokerId: "$worker._id",
                    },
                }
            },
            {
                $group: {
                    allWorkersAtt: {
                        $push: "$workerData"
                    },
                    _id: {
                        TodayDateIs : "$workerData.Att_Date"
                    },
                }
            }
        ])

        if(allAttendences.length < 1){
            return res.json({
                message : "No Attendences  Found" ,
                success: false,
            });
        }

            return res.json({
            AllAttendences :allAttendences ,
            success: true,
        });
    } catch (error) {
        console.log("Error in getAllAttendencesOfToday and error is : ", error)
        return res.json({
            error : "Could Not Perform Action",
            success: true,
        });
    }
}


// ====>    Manager    Apis     <<<=====


// add new attendence by manager
const addNewAttendenceByManager = async (req, res) => {
    const { isPresent , date , worker , manager, overTime , site } = req.body;
    if (!isPresent || !date || !worker || !manager || !overTime || !site) {
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

        const checkAdmin = await Managers.findOne({_id : manager , site : site});
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Manager of This Site can only Make Changes'
            })
        }

        const check = await Workers.findById(worker)
        if (!check) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }
        let checkAttendence = await Attendences.findOne({date : date , worker : worker , site : site })
        if (checkAttendence) {
            if(checkAttendence.isPresent !== true){
                checkAttendence.isPresent = true
            }else{
                checkAttendence.isPresent = false
            }
            await Attendences.findByIdAndUpdate(checkAttendence._id , {$set : {...checkAttendence} }, {$new : true})
            res.status(201).json({
                success: true,
                message: 'Worker Attendence Status Changed'
            })
        }else {
                req.body.site = site
                const newAttences = new Attendences({...req.body})
                try {
                    await newAttences.save();

                    res.status(201).json({
                        success: true,
                        message: 'New Worker Attendence SuccessFully Added'
                    })
                } catch (error) {
                    console.log("Error in addNewAttendence and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all of yesterday attendces date wise By manager
const getAllAttendencesOfYesterdayByManager = async (req, res) => {
    const {manager , site} = req.params;

    const newGotDate = new Date()
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();
    let gotDay = newGotDate.getDate();

    let diff = 0;
    let newDiff = 0;
    diff = gotDay - 1;
    newDiff = diff;
    if (diff < 0) {
        diff = -diff;
        //  checking last date of month to subtract
        if (gotMonth === 0 || gotMonth === 2 || gotMonth === 4 || gotMonth === 6 || gotMonth === 7 || gotMonth === 9 || gotMonth === 11) {
            newDiff = 31 - diff;
        }
        if (gotMonth === 3 || gotMonth === 5 || gotMonth === 8 || gotMonth === 10 ) {
            newDiff = 30 - diff;
        }
        if (gotMonth === 1) {
            newDiff = 28 - diff;
        }

        if (newGotDate.getMonth() === 0){
            newGotDate.setMonth(11)
            newGotDate.setFullYear(newGotDate.getFullYear() - 1);
            gotYear = newGotDate.getFullYear();
            gotMonth = newGotDate.getMonth()
        }else{
            console.log("Inner inner")
            newGotDate.setMonth(newGotDate.getMonth())
            gotMonth = newGotDate.getMonth()
        }
    }
    newGotDate.setDate(newDiff)
    let finalGotDate = gotYear + "-" + gotMonth + "-" + ( newDiff ) ; // previous adate

    try {
        const checkSite = await Sites.findById(site);
        if(!checkSite){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        const checkAdmin = await Managers.findOne({_id : manager , site : site});
        if(!checkAdmin) {
            return res.json({
                error : "Manager of this site can only make changes",
                success: false,
            });
        }

            const allAttendences = await Attendences.aggregate([
            {
                $match : {
                    date:  finalGotDate,
                    site:  mongoose.Types.ObjectId(site)
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
                    _id: {
                        Att_Id : "$_id",
                        Att_Date : "$date",
                        Att_Present : "$isPresent",
                        Att_OverTime : "$overTime",
                        WokerName: "$worker.name",
                        WokerId: "$worker._id",
                    },
                }
            },
            {
                $group: {
                    _id: {
                        Att_Id: "$_id.Att_Id",
                        Att_Date: "$_id.Att_Date",
                        Att_Present: "$_id.Att_Present",
                        Att_OverTime: "$_id.Att_OverTime",
                        WokerName: "$_id.WokerName",
                        WokerId: "$_id.WokerId",
                    },
                }
            }
        ])

        if(allAttendences.length < 1){
            return res.json({
                message : "No Attendences  Found" ,
                success: false,
            });
        }


            return res.json({
            AllAttendences :allAttendences ,
            success: true,
        });
    } catch (error) {
        console.log("Error in getAllAttendencesOfYesterdayByManager and error is : ", error)
        return res.json({
            error : "Could Not Perform Action",
            success: true,
        });
    }
}

// getting all of today's attendces date wise by mamager
const getAllAttendencesOfTodayByManager = async (req, res) => {
    const {manager , site} = req.params;

    const newGotDate = new Date()
    let finalGotDate = newGotDate.getFullYear() + "-" + (newGotDate.getMonth() + 1) + "-" +  newGotDate.getDate() ;
    try {
        const checkSite = await Sites.findById(site);
        if(!checkSite){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        const checkAdmin = await Managers.findOne({_id : manager , site : site});
        if(!checkAdmin) {
            return res.json({
                error : "Manager of this site can only make changes",
                success: false,
            });
        }

            const allAttendences = await Attendences.aggregate([
            {
                $match : {
                    date:  finalGotDate,
                    site:  mongoose.Types.ObjectId(site)
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
                    _id: {
                        Att_Id : "$_id",
                        Att_Date : "$date",
                        Att_Present : "$isPresent",
                        Att_OverTime : "$overTime",
                        WokerName: "$worker.name",
                        WokerId: "$worker._id",
                    },
                }
            },
            {
                $group: {
                    _id: {
                        Att_Id: "$_id.Att_Id",
                        Att_Date: "$_id.Att_Date",
                        Att_Present: "$_id.Att_Present",
                        Att_OverTime: "$_id.Att_OverTime",
                        WokerName: "$_id.WokerName",
                        WokerId: "$_id.WokerId",
                    },
                }
            }
        ])

        if(allAttendences.length < 1){
            return res.json({
                message : "No Attendences  Found" ,
                success: false,
            });
        }


            return res.json({
            AllAttendences :allAttendences ,
            success: true,
        });
    } catch (error) {
        console.log("Error in getAllAttendencesOfTodayByManager and error is : ", error)
        return res.json({
            error : "Could Not Perform Action",
            success: true,
        });
    }
}

// mark all active workers absent by default at 12 am
const markAllActiveWorkersAbsentAtNight = async (req, res) => {
    const newGotDate = new Date()
    let finalGotDate = newGotDate.getFullYear() + "-" + (newGotDate.getMonth() + 1) + "-" +  newGotDate.getDate() ;
    console.log("finalGotDate : ",finalGotDate)
    try {
            const getAllActiveWorkers = await Workers.find({activeStatus : true});
                for(let i = 0; i !== getAllActiveWorkers.length; i++){
                    let userBody = {
                        site : getAllActiveWorkers[i].site,
                        isPresent : false,
                        date : finalGotDate,
                        worker : getAllActiveWorkers[i]._id,
                        owner : getAllActiveWorkers[i].owner,
                        overTime : 0,
                    };

                    console.log("userBody : ", userBody)

                    const newAttences = new Attendences({...userBody})
                    try {
                        await newAttences.save();
                    } catch (error) {
                        console.log("Error in addNewAttendence and error is : ", error)
                    }
                }
            return res.json({
            message : "All Active Workers have been marked as Absent for Tomorrow",
            success: true,
        });
    } catch (error) {
        console.log("Error in markAllActiveWorkersAbsentAtNight and error is : ", error)
        res.json({
            error : "Could Not Perform Action",
            success: true,
        });
    }
}

// calling un subscribe every day at night 12 am
cron.schedule('55 23 * * *', function() {
    console.log('going to mark all active workers attendence of tomorrow as absent ');

    // curent date
    const newGotDate = new Date()
    let finalGotDate = newGotDate.getFullYear() + "-" + (newGotDate.getMonth() + 1) + "-" +  newGotDate.getDate() ;

    const deleteSubs = async () => {
        const getAllActiveWorkers = await Workers.find({activeStatus : true});
                for(let i = 0; i !== getAllActiveWorkers.length; i++){
                    let userBody = {
                        site : getAllActiveWorkers[i].site,
                        isPresent : false,
                        date : finalGotDate,
                        worker : getAllActiveWorkers[i]._id,
                        owner : getAllActiveWorkers[i].owner,
                        overTime : 0,
                    };

                    const newAttences = new Attendences({...userBody})
                    console.log("getAllActiveWorkers[i]._id : ", getAllActiveWorkers[i].owner , " getAllActiveWorkers[i].site " , getAllActiveWorkers[i].site)
                    try {
                        await newAttences.save();
                    } catch (error) {
                        console.log("Error in addNewAttendence and error is : ", error)
                    }
                }
    }
    deleteSubs();
});


module.exports = {
    addNewAttendence,
    getAllAttendencesInDuration,
    getAllAttendencesOfYesterday,
    getAllAttendencesOfToday,
    addNewAttendenceByManager,
    getAllAttendencesOfYesterdayByManager,
    getAllAttendencesOfTodayByManager,
    markAllActiveWorkersAbsentAtNight,
}