const mongoose = require("mongoose");

const SiteCashRegisterSchema = new mongoose.Schema({
    site: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisessites'
    },
    cashGiven: {
        type: Number,
        default : 0,
    },
    totalCashGiven: {
        type: Number,
        default : 0,
    },
    date: {
        type: String,
        required : true
    },
}, {
    timestamps: true
});


const MoruEnterprisesSitesCashRegister = mongoose.model('MoruEnterprisesSitesCashRegister', SiteCashRegisterSchema);

module.exports = MoruEnterprisesSitesCashRegister