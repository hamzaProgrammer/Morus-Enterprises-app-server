const express = require('express');
const router = express.Router();
const {
    addNewAdmin,
    LogInUser
} = require('../controllers/AdminControllers')
// const multer = require("multer")
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './userProfPics/')
//         //cb(null, '../products')
//     },
//     filename: function (req, file, cb) {
//         cb(null, 'image-' + Date.now() + file.originalname)
//     }
// })
// const upload = multer({
//     storage: storage,
// });


// Sign Up Admin
router.post('/api/admin/register', addNewAdmin)


// Sign Up Admin
router.post('/api/admin/signin', LogInUser)

module.exports = router;