const Admins = require('../models/AdminSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


// Sign Up new Admin
const addNewAdmin = async (req, res) => {
    const { phoneNo , password } = req.body;
    if (!phoneNo || !password) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const check = await Admins.find({
            phoneNo: phoneNo
        })
        if (check.length > 0) {
            return res.json({
                success: false,
                message: 'Admin Already Exists'
            })
        } else {
                req.body.password = await bcrypt.hash(password, 10); // hashing password
                const newUser = new Admins({...req.body})
                try {
                    await newUser.save();

                    res.status(201).json({
                        succes: true,
                        message: 'Admin SuccessFully Added'
                    })
                } catch (error) {
                    console.log("Error in addNewAdmin and error is : ", error)
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
    const { phoneNo ,  password } = req.body

        if(!phoneNo  || !password){
            return res.json({success: false , message : "Please fill Required Credientials"})
        }else {
            try {
                const isOprExists = await Admins.findOne({phoneNo: phoneNo}, {createdAt :0 , updatedAt : 0 , __v : 0});

                if(!isOprExists){
                    return res.json({success: false ,  message: "Admin Not Found"})
                }
                    const isPasswordCorrect = await bcrypt.compare(password, isOprExists.password); // comparing password
                    if (!isPasswordCorrect) {
                        return res.json({
                            success: false,
                            message: 'Invalid Credientials'
                        })
                    }

                    const token = jwt.sign({id: isOprExists._id} , JWT_SECRET_KEY , {expiresIn: '24h'}); // gentating token

                    return res.json({
                        AdminData:{
                            Id : isOprExists._id,
                            PhoneNo : isOprExists.phoneNo,
                        },
                        success: true,
                        token
                    });
            } catch (error) {
                console.log("Error in LogInUser and error is : ", error)
                return res.json({
                    success: false,
                    error
                });
            }
        }

}


module.exports = {
    addNewAdmin,
    LogInUser,
}