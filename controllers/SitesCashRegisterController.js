const Sites = require('../models/SitesSchema')
const Admins = require('../models/AdminSchema')
const CashRegisters = require('../models/SiteCashRegister')
const Managers = require('../models/ManagerSchema')


// adding cash to site
const addCashToSite = async (req, res) => {
    const {id,owner} = req.params;
    const {amount} = req.body;

    // got date
    const newGotDate = new Date()
    let gotMonth = newGotDate.getMonth() + 1;
    const finalDate = newGotDate.getFullYear() + "-" + gotMonth + "-" + newGotDate.getDate();

    if (!id ||!owner || !amount) {
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

        const checkSite = await Sites.findById(id);
        if(!checkSite){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        const check = await CashRegisters.findOne({
            date  : finalDate , site  : id
        })
        if (check) {
            return res.json({
                success: false,
                message: 'Cash Added Already'
            })
        } else {
            req.body.date = "";
            req.body.totalCashGiven = "";
            req.body.cashGiven = "";
            req.body.site = null;

            req.body.date = finalDate;
            req.body.totalCashGiven += Number(amount);
            req.body.cashGiven = Number(amount);
            req.body.site = id

            const newCashRegister = new CashRegisters({...req.body})
            try {
                await newCashRegister.save();

                res.status(201).json({
                    success: true,
                    message: 'New Cash Register SuccessFully Added'
                })
            } catch (error) {
                console.log("Error in addCashToSite and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// update cash to site
const updateCashOfSite = async (req, res) => {
    const {id,owner} = req.params;
    const {amount , date} = req.body;

    if (!id ||!owner || !amount || !date) {
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

        let check = await CashRegisters.findById(id)
        if (!check) {
            return res.json({
                success: false,
                message: 'Cash Register Not Found'
            })
        } else {
            try {
                check.totalCashGiven -= Number(check.cashGiven);
                check.cashGiven = Number(amount);
                check.totalCashGiven += Number(amount);
                check.date = date;
                await CashRegisters.findByIdAndUpdate(id , {$set : {...check}} , {new : true})

                res.status(201).json({
                    success: true,
                    message: 'Cash Register Updates SuccessFully'
                })
            } catch (error) {
                console.log("Error in updateCashOfSite and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// get  history Cash Given to any shop
const getHistoryOfCashGiven = async (req, res) => {
    const {id,owner} = req.params;
    const cDate = new Date();
    const finalDate = cDate.getFullYear() + "-" + (cDate.getMonth() + 1) + "-" + 1;

    if (!id ||!owner ) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Admins.findById(owner , {createdAt : 0 , updatedAt : 0 , __v : 0 , site : 0});
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Admin Not Found'
            })
        }

        const check = await CashRegisters.find({site : id , date : {$gte :finalDate } } , {createdAt : 0 , updatedAt : 0 , __v : 0 , totalCashGiven : 0 })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'No Cash Given History Found'
            })
        } else {
                const totalCashGiven = await CashRegisters.find({site : id, date : {$gte :finalDate } } , {totalCashGiven : 1 , _id : 0 })
                let totalSum = 0;
                for (let i = 0 ; i !== totalCashGiven.length ; i++ ){
                    totalSum += totalCashGiven[i].totalCashGiven;
                }
            try {
                res.status(201).json({
                    success: true,
                    CashGivenHistory : check,
                    TotalCashGiven : totalSum
                })
            } catch (error) {
                console.log("Error in getHistoryOfCashGiven and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// get  history Cash Given to any shop
const getHistoryOfCashGivenByManager = async (req, res) => {
    const {id,manager } = req.params;

    if (!id ||!manager) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkSite = await Sites.findById(id);
        if(!checkSite){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        const checkAdmin = await Managers.findById({_id : manager , site : id});
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Manager of this site can only make changes'
            })
        }

        const check = await CashRegisters.find({site : id } , {createdAt : 0 , updatedAt : 0 , __v : 0 , totalCashGiven : 0 })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'No Cash Given History Found'
            })
        } else {
                const totalCashGiven = await CashRegisters.find({site : id } , {totalCashGiven : 1 , _id : 0 })
            try {
                res.status(201).json({
                    success: true,
                    CashGivenHistory : check,
                    TotalCashGiven : totalCashGiven
                })
            } catch (error) {
                console.log("Error in getHistoryOfCashGiven and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// adding cash to site
const addCashToSiteByManager = async (req, res) => {
    const {id,manager} = req.params;
    const {amount} = req.body;

    // got date
    const newGotDate = new Date()
    let gotMonth = newGotDate.getMonth() + 1;
    const finalDate = newGotDate.getFullYear() + "-" + gotMonth + "-" + newGotDate.getDate();

    if (!id ||!manager || !amount) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkSite = await Sites.findById(id);
        if(!checkSite){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        const checkAdmin = await Managers.findById({_id : manager , site : id});
        if(!checkAdmin){
            return res.json({
                success: false,
                message: 'Manager of this site can only make changes'
            })
        }
        const check = await CashRegisters.findOne({
            date  : finalDate , site  : id
        })
        if (check) {
            return res.json({
                success: false,
                message: 'Cash Added Already'
            })
        } else {
            req.body.date = "";
            req.body.totalCashGiven = "";
            req.body.cashGiven = "";
            req.body.site = null;

            req.body.date = finalDate;
            req.body.totalCashGiven += Number(amount);
            req.body.cashGiven = Number(amount);
            req.body.site = id

            const newCashRegister = new CashRegisters({...req.body})
            try {
                await newCashRegister.save();

                res.status(201).json({
                    success: true,
                    message: 'New Cash Register SuccessFully Added'
                })
            } catch (error) {
                console.log("Error in addCashToSite and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

module.exports = {
    addCashToSite,
    updateCashOfSite,
    getHistoryOfCashGiven,
    getHistoryOfCashGivenByManager,
    addCashToSiteByManager
}