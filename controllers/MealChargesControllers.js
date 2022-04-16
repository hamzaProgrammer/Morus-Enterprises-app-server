const Workers = require('../models/WorkerSchema')
const MealCharges = require('../models/MealChargesSchema')
const Admins = require('../models/AdminSchema')
const Managers = require('../models/ManagerSchema')
const Sites = require('../models/SitesSchema')


// add new meal charge
const addNewMealCharge = async (req, res) => {
    const { worker , mealCharge , date , owner , site} = req.body;

    if (!worker || !mealCharge || !date || !site) {
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
        let checkMealCharge = await MealCharges.findOne({date : date , worker : worker})
        if (checkMealCharge) {
            checkSite.mealCharges -= checkMealCharge.mealCharge
            checkMealCharge.mealCharge = Number(mealCharge)

            // updating site
            checkSite.mealCharges += checkMealCharge.mealCharge
            await Sites.findByIdAndUpdate(site , {$set : {...checkSite} }, {$new : true})

            // updating meal charge
            await MealCharges.findByIdAndUpdate(checkMealCharge._id , {$set : {...checkMealCharge} }, {$new : true})
            return res.status(201).json({
                success: true,
                message: 'Meal Charge Updated SuccessFully'
            })
        }else {
            req.body.site = site
            const newSiteAdvance = new MealCharges({...req.body})
            try {
                await newSiteAdvance.save();

                // updating site
                checkSite.mealCharges += Number(mealCharge)
                let uup = await Sites.findByIdAndUpdate(site , {$set : {...checkSite} }, {$new : true})


                res.status(201).json({
                    success: true,
                    message: 'New Meal Charge  SuccessFully Added'
                })
            } catch (error) {
                console.log("Error in addNewMealCharge and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// getting all meal charges of a date
const getAllMealChargesOfDate = async (req, res) => {
    const {id , userDate , site} = req.params;

    // curent date
    const curentDate = new Date(userDate);
    let sendingDate = curentDate.getFullYear() + "-" + (curentDate.getMonth() + 1) + "-" + curentDate.getDate();


    let finalGotDate = curentDate.getFullYear() + "-" + curentDate.getMonth() + "-" + curentDate.getDate() ;
    let message = `Record shown is from ${finalGotDate} to ${sendingDate} and having differnce of 30 Days.`;

    console.log("lesserr date : ", finalGotDate , "cuurent : ", sendingDate)

    const checkSite = await Sites.findById(site);
    if(!checkSite){
        return res.json({
            success: false,
            message: 'Site Not Found'
        })
    }

    const checkMelCharg = await Workers.findById(id);
    if(!checkMelCharg){
        return res.json({
            success: false,
            message: 'Worker Id May Be Incorrect'
        })
    }

    try {
            const allMealCharges = await MealCharges.find({
                worker: id,
                site : site,
                date: {
                    $gte: finalGotDate,
                    $lte: sendingDate
                },
            } , {_id : 1 , date : 1 , mealCharge : 1 });
            console.log("allMealCharges : ",allMealCharges)

            return res.json({
                AllMealCharges :allMealCharges,
                message : message,
                success: true,
            });
    } catch (error) {
        console.log("Error in getAllMealChargesOfDate and error is : ", error)
        return res.json({
            error : "Could Not Perform Action",
            success: true,
        });
    }
}

// add new meal charge
const addNewMealChargeByManager = async (req, res) => {
    const { worker , mealCharge , date , manager , site } = req.body;
    if (!worker || !mealCharge || !date || !manager || !site) {
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
        let checkMealCharge = await MealCharges.findOne({date : date , worker : worker})
        if (checkMealCharge) {
            checkMealCharge.mealCharge = Number(mealCharge)
            await MealCharges.findByIdAndUpdate(checkMealCharge._id , {$set : {...checkMealCharge} }, {$new : true})
            res.status(201).json({
                success: true,
                message: 'Meal Charge Updated SuccessFully'
            })
        }else {
            const newSiteAdvance = new MealCharges({...req.body})
            try {
                await newSiteAdvance.save();

                res.status(201).json({
                    success: true,
                    message: 'New Meal Charge  SuccessFully Added'
                })
            } catch (error) {
                console.log("Error in addNewMealCharge and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}



module.exports = {
    addNewMealCharge,
    getAllMealChargesOfDate,
    addNewMealChargeByManager,
    // getAllAttendencesOfToday,
}