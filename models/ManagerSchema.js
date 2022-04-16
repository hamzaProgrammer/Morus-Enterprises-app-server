const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    site: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisessites'
    },
    admin: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesadmins'
    },
    
}, {
    timestamps: true
});


const MoruEnterprisesManagers = mongoose.model('MoruEnterprisesManagers', ManagerSchema);

module.exports = MoruEnterprisesManagers