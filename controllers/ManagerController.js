const Managers = require('../models/ManagerSchema')
const Admins = require('../models/AdminSchema')
const Sites = require('../models/SitesSchema')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require('jsonwebtoken');




// Sign Up new manager
const addNewManager = async (req, res) => {
    const { name , phoneNo ,admin , site } = req.body;
    if (!name || !phoneNo || !admin || !site) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkAdmin = await Admins.findById(admin);
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
        const check = await Managers.findOne({
            phoneNo: phoneNo
        })
        if (check) {
            return res.json({
                success: false,
                message: 'Manager with same Phone Number Already Exists'
            })
        } else {
                const newManager = new Managers({...req.body})
                try {
                    await newManager.save();

                    res.status(201).json({
                        succes: true,
                        message: 'New Manager SuccessFully Added'
                    })
                } catch (error) {
                    console.log("Error in addNewManager and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// Logging In User
const LogInUser = async (req, res) => {
    const {phoneNo} = req.body

    if(!phoneNo){
        return res.json({success: false, message : "Phone Number is Required"})
    }else {
        try {
            const isOprExists = await Managers.findOne({phoneNo: phoneNo} , {createdAt : 0 , updatedAt : 0 , __v : 0});

            if(!isOprExists){
                return res.json({success: false ,  message: "Manager Not Found"})
            }
                const token = jwt.sign({id: isOprExists._id} , JWT_SECRET_KEY , {expiresIn: '24h'}); // gentating token

                return res.json({
                    myResult: isOprExists,
                    success : true,
                    token
                });
        } catch (error) {
            console.log("Error in LogInUser and error is : ", error)
            return res.json({
                error,
                success: false
            });
        }
    }

}


module.exports = {
    addNewManager,
    LogInUser
}