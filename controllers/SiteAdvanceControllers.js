const Workers = require('../models/WorkerSchema')
const SiteAdvances = require('../models/SitesAdvancesSchema')
const Admins = require('../models/AdminSchema')
const Managers = require('../models/ManagerSchema')
const Sites = require('../models/SitesSchema')
const URL = "https://morus-enterprises-server.herokuapp.com"
 

// add new site advance
const addNewSiteAdvance = async (req, res) => {
    const { worker , siteAdvance , date , site} = req.body;

    if (!worker || !siteAdvance || !date) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {

        let checkSite = await Sites.findById(site);
        if(!checkSite){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        let check = await Workers.findById(worker)
        if (!check) {
            return res.json({
                success: false,
                message: 'Worker Not Found'
            })
        }

        let checkSiteAdvance = await SiteAdvances.findOne({date : date , worker : worker})
        console.log("checkSiteAdvance : ",checkSiteAdvance)
        if (checkSiteAdvance) {
            checkSiteAdvance.siteAdvance = 0
            // updating site
            checkSiteAdvance.siteAdvance = siteAdvance
            let newIp = await SiteAdvances.findOneAndUpdate({date : date , worker : worker} , {$set : {...checkSiteAdvance} }, {$new : true})
            console.log("new site advance : ",newIp)
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
    const {id , site, date } = req.params;

    // got date
    const curentDate = new Date(date);
    let gotMonth = curentDate.getMonth() + 1;
    let gotYear = curentDate.getFullYear();

    console.log("gotMonth : ", gotMonth , " gotYear : ", gotYear)

    if (curentDate.getMonth() === 0){
        curentDate.setMonth(11)
        curentDate.setFullYear(curentDate.getFullYear() - 1);
        gotYear = curentDate.getFullYear();
        gotMonth = curentDate.getMonth()
    }else{
        curentDate.setMonth(curentDate.getMonth())
        gotMonth = curentDate.getMonth()
    }

    let d = new Date();
    let finDate = 0

    if((curentDate.getMonth() + 1) === 1 || (curentDate.getMonth() + 1) === 3 || (curentDate.getMonth() + 1) === 5 || (curentDate.getMonth() + 1) === 7 || (curentDate.getMonth() + 1) === 8 || (curentDate.getMonth() + 1) === 10 ||  (curentDate.getMonth() + 1) === 12 ){
        finDate = 31
    }else if((curentDate.getMonth() + 1) === 2){
        finDate = 28
    }else{
        finDate = 30
    }

    if((d.getMonth() + 1) === (gotMonth + 1)){
        finDate = d.getDate()
    }
    // curent date
    let sendingDate = gotYear + "-" + (gotMonth + 1 ) + "-" +  finDate;
    let finalGotDate = gotYear + "-" + (gotMonth + 1) + "-" + 1;

    let message = `Record shown is from ${finalGotDate} to ${sendingDate}.`;


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
                date :{
                    $gte : finalGotDate,
                    $lte : sendingDate
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

    // if(!req.file){
    //     return res.json({
    //         success: false,
    //         message: "User Photo is Required while Adding new Site Advance"
    //     });
    // }

    // if ((req.file.mimetype  !== "image/jpeg" && req.file.mimetype  !== "image/jpg" && req.file.mimetype  !== "image/webP" && req.file.mimetype  !== "image/png")) {
    //     return res.json({
    //         success: false,
    //         message: "First Image of Sliders Not Found"
    //     });
    // }

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
        // if (req.file) {
        //     var lower = req.file.filename.toLowerCase();
        //     req.body.picture = lower;
        // }
        let checkSiteAdvance = await SiteAdvances.findOne({date : date , worker : worker})
        if (checkSiteAdvance) {
            checkSiteAdvance.siteAdvance = Number(siteAdvance)
            // constcheckSiteAdvance.picture = URL + "/siteAdvancePics/" + req.file.filename.toLowerCase();
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