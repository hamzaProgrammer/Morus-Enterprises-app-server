const Reports = require('../models/ReportSchema')
const Workers = require('../models/WorkerSchema')

// add new report
const addNewReport = async (req, res) => {
    const { name , dateStart , dateEnd , presentDays , overTime , rate , grossWage , deductions , homeAdvances , allowances  , netWage } = req.body;
    if (!name || !dateStart || !dateEnd || !presentDays || !overTime || !rate || !grossWage || !deductions  || !netWage) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const worker = await Workers.findOne({name : name});
        if(!worker){
            return res.json({
                success: false,
                message: "Worker Not Found with Provided Name"
            });
        }

        req.body.workerId = worker._id;
        const newReport = new Reports({...req.body})
        try {
            await newReport.save();

            res.status(201).json({
                success: true,
                message: 'Report Saved SuccessFully'
            })
        } catch (error) {
            console.log("Error in addNewReport and error is : ", error)
            res.status(201).json({
                success: false,
                error : "Could Not Perform Action"
            })
        }
    }
}

// get all reports of a month
const getReportsOfSpecMonth = async (req, res) => {
    const {startDate , endDate } = req.params

        if(!startDate  || !endDate){
            return res.json({success: false , message : "Please fill Required Credientials"})
        }else {
            try {
                const isReports = await Reports.find({dateStart: startDate , dateEnd : endDate }, {name :1 , dateStart : 1 , dateEnd : 1 });

                if(isReports.length < 1){
                    return res.json({success: false ,  message: "No Reports Found in Date Range"})
                }

                return res.json({
                    AllReports : isReports,
                    success: true,
                });
            } catch (error) {
                console.log("Error in getReportsOfSpecMonth and error is : ", error)
                return res.json({
                    success: false,
                    error
                });
            }
        }

}

// get all reports of a workers unpaid in given month
const getUnPaidReportsOfSpecMonth = async (req, res) => {
    const {startDate , endDate } = req.params

    if(!startDate  || !endDate){
        return res.json({success: false , message : "Please fill Required Credientials"})
    }else {
        try {
            // getting all workers
            const allWorkers = await Workers.find();
            if(!allWorkers){
                return res.json({success: false , message : "Could Not Get All Workers"})
            }

            let allUnPaid = []
            for(let i = 0; i !== allWorkers.length; i++){
                const checkReport = await Reports.findOne({workerId : allWorkers[i]._id , dateStart: startDate , dateEnd : endDate});
                if(!checkReport){
                    let newObj = {
                        Id : allWorkers[i]._id,
                        Name : allWorkers[i].name,
                        Photo : allWorkers[i].profilePic
                    }
                    allUnPaid.push(newObj);
                }
            }

            if(allUnPaid.length < 1){
                return res.json({success: false ,  message: "No UnPaid Workers Found For This Month"})
            }

            return res.json({
                AllUnPaidWorkers : allUnPaid,
                success: true,
            });
        } catch (error) {
            console.log("Error in getUnPaidReportsOfSpecMonth and error is : ", error)
            return res.json({
                success: false,
                error
            });
        }
    }

}

// get single report of a worker
const getSingleReport = async (req, res) => {
    const {id} = req.params

        if(!id){
            return res.json({success: false , message : "Id of Report is Required"})
        }else {
            try {
                const isReports = await Reports.findById(id);

                if(!isReports){
                    return res.json({success: false ,  message: "No Report Found"})
                }

                return res.json({
                    Report : isReports,
                    success: true,
                });
            } catch (error) {
                console.log("Error in getSingleReport and error is : ", error)
                return res.json({
                    success: false,
                    error
                });
            }
        }

}


module.exports = {
    addNewReport,
    getReportsOfSpecMonth,
    getSingleReport,
    getUnPaidReportsOfSpecMonth,
}