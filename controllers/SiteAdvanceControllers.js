const Workers = require('../models/WorkerSchema')
const SiteAdvances = require('../models/SitesAdvancesSchema')
const Admins = require('../models/AdminSchema')
const Managers = require('../models/ManagerSchema')
const Sites = require('../models/SitesSchema')
const URL = "http://localhost:8080"
 

// add new site advance
const addNewSiteAdvance = async (req, res) => {
    const { worker , siteAdvance , date , owner , site} = req.body;

    if(!req.file){
        return res.json({
            success: false,
            message: "User Photo is Required while Adding new Site Advance"
        });
    }

    if ((req.file.mimetype  !== "image/jpeg" && req.file.mimetype  !== "image/jpg" && req.file.mimetype  !== "image/webP" && req.file.mimetype  !== "image/png")) {
        return res.json({
            success: false,
            message: "First Image of Sliders Not Found"
        });
    }

    if (!worker || !siteAdvance || !date) {
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

        let checkSite = await Sites.findById(site);
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
        if (req.file) {
            var lower = req.file.filename.toLowerCase();
            req.body.picture = URL + "/siteAdvancePics/" + lower;
        }
        let checkSiteAdvance = await SiteAdvances.findOne({date : date , worker : worker})
        if (checkSiteAdvance) {
            checkSite.siteAdvances -= checkSiteAdvance.siteAdvance

            // updating site advance
            checkSiteAdvance.siteAdvance = Number(siteAdvance)
            checkSiteAdvance.picture = URL + "/siteAdvancePics/" + req.file.filename.toLowerCase();
            await SiteAdvances.findByIdAndUpdate(checkSiteAdvance._id , {$set : {...checkSiteAdvance} }, {$new : true})

            // updating site
            checkSite.siteAdvances += checkSiteAdvance.siteAdvance
            await Sites.findByIdAndUpdate(site , {$set : {...checkSite} }, {$new : true})
            return res.status(201).json({
                success: true,
                message: 'Site Advance Updated SuccessFully'
            })
        }else {
                const newSiteAdvance = new SiteAdvances({...req.body})
                try {
                    await newSiteAdvance.save();

                    // updating site
                    checkSite.siteAdvances += Number(siteAdvance)
                    await Sites.findByIdAndUpdate(site , {$set : {...checkSite} }, {$new : true})

                    res.status(201).json({
                        success: true,
                        message: 'New Site Advance SuccessFully Added'
                    })
                } catch (error) {
                    console.log("Error in addNewSiteAdvance and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all site advances of a date
const getAllSiteAdvanceOfDate = async (req, res) => {
    const {id , userDate , site } = req.params;

    // got date
    const curentDate = new Date(userDate);
    let gotMonth = curentDate.getMonth() + 1;
    let gotYear = curentDate.getFullYear();


    if (curentDate.getMonth() === 0){
        curentDate.setMonth(11)
        curentDate.setFullYear(curentDate.getFullYear() - 1);
        gotYear = curentDate.getFullYear();
        gotMonth = curentDate.getMonth()
    }else{
        curentDate.setMonth(curentDate.getMonth())
        gotMonth = curentDate.getMonth()
    }

    let sendingDate = curentDate.getFullYear() + "-" + (curentDate.getMonth() + 1) + "-" + (curentDate.getDate() + 1);
    let finalGotDate = curentDate.getFullYear() + "-" + curentDate.getMonth() + "-" + (curentDate.getDate() +  1);
    
    console.log("current Date ", userDate , "prevouse date : ",finalGotDate )
    let message = `Record shown is from ${finalGotDate} to ${sendingDate} and having differnce of 30 Days.`;


    const checkWorker = await Workers.findById(id);
    if(!checkWorker){
        return res.json({
            message : "Worker Not Found",
            success: false,
        });
    }

    const check = await Sites.findById(site);
    if(!check){
        return res.json({
            message : "No Site Found",
            success: false,
        });
    }
    try {
            const allSiteAdvance = await SiteAdvances.find({
                worker: id,
                site : site,
                createdAt :{
                    $gte : new Date(finalGotDate),
                    $lte : new Date(sendingDate)
                },
            } , {_id : 1 , date : 1 , siteAdvance : 1 });

            return res.json({
            AllSiteAdvance :allSiteAdvance ,
            success: true,
            message : message
        });
    } catch (error) {
        console.log("Error in getAllSiteAdvanceOfDate and error is : ", error)
        return res.json({
            error : "Could Not Perform Action",
            success: false,
        });
    }
}


// add new site advance By manager
const addNewSiteAdvanceByManager = async (req, res) => {
    const { worker , siteAdvance , date , manager , site} = req.body;

    if(!req.file){
        return res.json({
            success: false,
            message: "User Photo is Required while Adding new Site Advance"
        });
    }

    if ((req.file.mimetype  !== "image/jpeg" && req.file.mimetype  !== "image/jpg" && req.file.mimetype  !== "image/webP" && req.file.mimetype  !== "image/png")) {
        return res.json({
            success: false,
            message: "First Image of Sliders Not Found"
        });
    }

    if (!worker || !siteAdvance || !date || !manager || !site) {
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

        const checkAdmin = await Managers.findById({_id : manager , site : site});
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Manager of this site can only make changes'
            })
        }

        const check = await Workers.findById(worker)
        if (!check) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }
        if (req.file) {
            var lower = req.file.filename.toLowerCase();
            req.body.picture = lower;
        }
        let checkSiteAdvance = await SiteAdvances.findOne({date : date , worker : worker})
        if (checkSiteAdvance) {
            checkSiteAdvance.siteAdvance = Number(siteAdvance)
            checkSiteAdvance.picture = URL + "/siteAdvancePics/" + req.file.filename.toLowerCase();
            await SiteAdvances.findByIdAndUpdate(checkSiteAdvance._id , {$set : {...checkSiteAdvance} }, {$new : true})
            res.status(201).json({
                success: true,
                message: 'Site Advance Updated SuccessFully'
            })
        }else {
                const newSiteAdvance = new SiteAdvances({...req.body})
                try {
                    await newSiteAdvance.save();

                    res.status(201).json({
                        success: true,
                        message: 'New Site Advance SuccessFully Added'
                    })
                } catch (error) {
                    console.log("Error in addNewSiteAdvance and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}


module.exports = {
    addNewSiteAdvance,
    getAllSiteAdvanceOfDate,
    addNewSiteAdvanceByManager,
}