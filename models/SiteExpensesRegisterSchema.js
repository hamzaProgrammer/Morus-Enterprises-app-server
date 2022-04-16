const mongoose = require("mongoose");

const SiteMealChargesSchema = new mongoose.Schema({
    site: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisessites'
    },
    amount: {
        type: Number,
        required : true
    },
    totalExpenses: {
        type: Number,
        default : 0
    },
    detail: {
        type: String,
        required : true
    },
    date: {
        type: String,
        required : true
    },
}, {
    timestamps: true
});


const MoruEnterprisesSitesMealCharges = mongoose.model('MoruEnterprisesSitesMealCharges', SiteMealChargesSchema);

module.exports = MoruEnterprisesSitesMealCharges