const Sites = require('../models/SitesSchema')
const Admins = require('../models/AdminSchema')



// Sign Up new Site
const addNewSite = async (req, res) => {
    const { siteName , location , owner} = req.body;
    if (!siteName || !location || !owner) {
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
        const check = await Sites.find({
            siteName: siteName , owner : owner
        })
        if (check.length > 0) {
            return res.json({
                success: false,
                message: 'Site Already Exists'
            })
        } else {
                const newSite = new Sites({...req.body})
                try {
                    await newSite.save();

                    res.status(201).json({
                        success: true,
                        message: 'New Site SuccessFully Added'
                    })
                } catch (error) {
                    console.log("Error in addNewSite and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all sites of an admin
const getAllSites = async (req, res) => {
    const { owner} = req.params;
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
        const check = await Sites.find({
            owner : owner
        }, {createdAt : 0 , updatedAt : 0 , __v :0 })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        } else {
                try {
                    res.status(201).json({
                        success: true,
                        SiteData : check,
                    })
                } catch (error) {
                    console.log("Error in getAllSites and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting single sites of an admin
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
        const check = await Sites.find({
            _id : id , owner : owner
        }, {createdAt : 0 , updatedAt : 0 , __v :0 })
        if (check.length < 1) {
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        } else {
                try {
                    res.status(201).json({
                        success: true,
                        SiteData : check,
                    })
                } catch (error) {
                    console.log("Error in getSingleSite and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// adding cash to site
const addCashToSite = async (req, res) => {
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
        let check = await Sites.findOne({
            _id : id , owner : owner
        })
        if (!check) {
            return res.json({
                success: false,
                message: 'Site Not Found'
            })
        } else {
                try {
                    check.cashGiven += Number(amount);
                    await Sites.findByIdAndUpdate(id , {$set : {...check}} , {new : true})

                    res.status(201).json({
                        success: true,
                        message : "Cash SuccessFully Added",
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
    addNewSite,
    getAllSites,
    getSingleSite,
    addCashToSite
}