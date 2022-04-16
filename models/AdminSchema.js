const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    phoneNo: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});


const MoruEnterprisesAdmins = mongoose.model('MoruEnterprisesAdmins', AdminSchema);

module.exports = MoruEnterprisesAdmins