const Sites = require('../models/SitesSchema')
const Admins = require('../models/AdminSchema')
const Expenses = require('../models/SiteExpensesRegisterSchema')
const Managers = require('../models/ManagerSchema')
const CashRegisters = require('../models/SiteCashRegister')

// adding new expense to site
const addExpenseToSite = async (req, res) => {
    const {id,owner} = req.params;
    const {amount , detail} = req.body;

    // got date
    const newGotDate = new Date()
    let gotMonth = newGotDate.getMonth() + 1;
    const finalDate = newGotDate.getFullYear() + "-" + gotMonth + "-" + newGotDate.getDate();


    if (!id || !owner || !amount || !detail) {
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

        const check = await Expenses.find({
            date  : finalDate ,  detail : detail , site : id
        })
        if (check.length > 0) {
            return res.json({
                success: false,
                message: 'Site Expense Already Added'
            })
        } else {
            req.body.date = "";
            req.body.date = finalDate;
            req.body.totalExpenses = "";
            req.body.totalExpenses += Number(amount);
            req.body.site = "";
            req.body.site = id;

            const newCashRegister = new Expenses({...req.body})
            try {
                await newCashRegister.save();

                res.status(201).json({
                    success: true,
                    message: 'New Site Expense SuccessFully Added'
                })
            } catch (error) {
                console.log("Error in addExpenseToSite and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// update meal charges/expense to site
const updateExpenseOfSite = async (req, res) => {
    const {id,owner} = req.params;
    const {amount , detail} = req.body;

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

        let check = await Expenses.findById(id)
        if (!check) {
            return res.json({
                success: false,
                message: 'Cash Register Not Found'
            })
        } else {
            try {
                check.totalExpenses -= check.amount;
                check.amount = Number(amount);
                check.totalExpenses += Number(amount);
                check.detail  = detail;
                await Expenses.findByIdAndUpdate(id , {$set : {...check}} , {new : true})

                res.status(201).json({
                    success: true,
                    message: 'Site Expenses Updates SuccessFully'
                })
            } catch (error) {
                console.log("Error in updateExpenseOfSite and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// get  history site meal charges Given to any shop
const getHistoryOfMealChargesGiven = async (req, res) => {
    const {id} = req.params;

    if (!id ) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {

        const checkSite = await Sites.findById(id , {_id : 0 , mealCharges : 1 , siteAdvances : 1});
        if(!checkSite){
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        }

        const check = await Expenses.find({site : id }, {createdAt : 0 , updatedAt : 0 , __v : 0 , totalExpenses : 0 , site : 0 })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'No Expenses Given History Found'
            })
        } else {
                const totalExpense = await Expenses.find({site : id  })
                console.log("totalExpense : ",totalExpense)
                let totalSum = 0;
                for (let i = 0 ; i !== totalExpense.length ; i++ ){
                    totalSum += totalExpense[i].totalExpenses;
                }
            try {
                res.status(201).json({
                    success: true,
                    ExpenseHistory : check,
                    SiteCharges : checkSite,
                    TotalExpense : totalSum
                })
            } catch (error) {
                console.log("Error in getHistoryOfMealChargesGiven and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// get  history site meal charges Given to any shop
const getSitePaymentHistory = async (req, res) => {
    const {id, owner , userDate} = req.params;

    // got date
    const newGotDate = new Date(userDate)
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();
    let gotDay = newGotDate.getDate();

    let diff = 0;
    let newDiff = 0;
    diff = gotDay - 7;
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
            newGotDate.setMonth(newGotDate.getMonth())
            gotMonth = newGotDate.getMonth()
        }
    }

    newGotDate.setDate(newDiff)

    let finalGotDate = gotYear + "-" + gotMonth + "-" + ( newDiff ) ; // previous adate
    console.log("User Date ", userDate , " crnt date : ",finalGotDate )
    let message = `Record shown is from  ${finalGotDate} to ${userDate} and having difference of 7 Days.`;

    if (!id ||!owner ) {
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

        const check = await Expenses.find({
                site : id,
                $and : [
                    {
                        date: {
                            $gte: finalGotDate,
                        }
                    },
                    {
                        date: {
                            $lte: userDate
                        },
                    }
                ]
            } , {totalExpenses : 1 , _id : 0 });
        
         const checkCashGiven = await CashRegisters.findOne({
                site : id,
                $and : [
                    {
                        date: {
                            $gte: finalGotDate,
                        }
                    },
                    {
                        date: {
                            $lte: userDate
                        },
                    }
                ]
            } , {totalCashGiven : 1 , _id : 0 });

        if (!checkCashGiven) {
            return res.json({
                success: false,
                message: 'No Cash  Given History Found'
            })
        } else {
            const diff = checkCashGiven.totalCashGiven -  check.totalExpenses;
            try {
                res.status(201).json({
                    success: true,
                    AllCashGiven : checkCashGiven.totalCashGiven,
                    AllExpense : check.totalExpenses,
                    Balance : diff,
                    message : message,
                })
            } catch (error) {
                console.log("Error in getSitePaymentHistory and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// get  history site meal charges Given to any shop by maanger
const getSitePaymentHistoryByManager = async (req, res) => {
    const {id, manager , userDate} = req.params;

    // got date
    const newGotDate = new Date(userDate)
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();
    let gotDay = newGotDate.getDate();

    let diff = 0;
    let newDiff = 0;
    diff = gotDay - 7;
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
            newGotDate.setMonth(newGotDate.getMonth())
            gotMonth = newGotDate.getMonth()
        }
    }

    newGotDate.setDate(newDiff)
    
    let finalGotDate = gotYear + "-" + gotMonth + "-" + ( newDiff ) ; // previous adate
    console.log("User Date ", userDate , " crnt date : ",finalGotDate )
    let message = `Record shown is from  ${finalGotDate} to ${userDate} and having difference of 7 Days.`;

    if (!id ||!manager ) {
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

        const check = await Expenses.find({
                site : id,
                date: {
                    $gte: finalGotDate,
                    $lte: userDate
                },
            } , {totalExpenses : 1 , _id : 0 });
        
         const checkCashGiven = await CashRegisters.findOne({
                site : id,
                date: {
                    $gte: finalGotDate,
                    $lte: userDate
                },
            } , {totalCashGiven : 1 , _id : 0 });

        if (!checkCashGiven) {
            return res.json({
                success: false,
                message: 'No Cash  Given History Found'
            })
        } else {
            const diff = checkCashGiven.totalCashGiven -  check.totalExpenses;
            try {
                res.status(201).json({
                    success: true,
                    AllCashGiven : checkCashGiven.totalCashGiven,
                    AllExpense : check.totalExpenses,
                    Balance : diff,
                    message : message,
                })
            } catch (error) {
                console.log("Error in getSitePaymentHistory and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// adding new expense to site
const addExpenseToSiteByManager = async (req, res) => {
    const {id,manager} = req.params;
    const {amount , detail} = req.body;

    // got date
    const newGotDate = new Date()
    let gotMonth = newGotDate.getMonth() + 1;
    const finalDate = newGotDate.getFullYear() + "-" + gotMonth + "-" + newGotDate.getDate();

    if (!id || !manager || !amount || !detail) {
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

        const check = await Expenses.find({
            date  : finalDate ,  detail : detail, site : id
        })
        if (check.length > 0) {
            return res.json({
                success: false,
                message: 'Site Expense Already Added'
            })
        } else {
            req.body.date = "";
            req.body.date = finalDate;
            req.body.totalExpenses = "";
            req.body.totalExpenses += Number(amount);
            req.body.site = "";
            req.body.site = id;

            const newCashRegister = new Expenses({...req.body})
            try {
                await newCashRegister.save();

                res.status(201).json({
                    success: true,
                    message: 'New Site Expense SuccessFully Added'
                })
            } catch (error) {
                console.log("Error in addExpenseToSite and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

// get  history site meal charges Given to any shop by manager
const getHistoryOfMealChargesGivenByManager = async (req, res) => {
    const {id,manager} = req.params;

    if (!id ||!manager ) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkSite = await Sites.findById(id ,  {_id : 0 , mealCharges : 1 , siteAdvances : 1});
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

        const check = await Expenses.find({site : id } , {createdAt : 0 , updatedAt : 0 , __v : 0 , totalExpenses : 0 , site : 0 })
        console.log("check : ",check)
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'No Expenses Given History Found'
            })
        } else {
                const totalExpense = await Expenses.find({site : id } , {totalExpenses : 1 , _id : 0 })
            try {
                res.status(201).json({
                    success: true,
                    ExpenseHistory : check,
                    SiteCharges : checkSite,
                    TotalExpense : totalExpense
                })
            } catch (error) {
                console.log("Error in getHistoryOfMealChargesGiven and error is : ", error)
                res.status(201).json({
                    success: false,
                    error : "Could Not Perform Action"
                })
            }
        }
    }
}

module.exports = {
    addExpenseToSite,
    updateExpenseOfSite,
    getHistoryOfMealChargesGiven,
    getSitePaymentHistory,
    getSitePaymentHistoryByManager,
    addExpenseToSiteByManager,
    getHistoryOfMealChargesGivenByManager
}