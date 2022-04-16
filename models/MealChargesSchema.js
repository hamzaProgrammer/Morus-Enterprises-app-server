const mongoose = require("mongoose");

const MealChargesSchema = new mongoose.Schema({
    mealCharge: {
        type: Number,
        default : '0'
    },
    date: {
        type: String,
        required: true,
    },
    worker: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesadmins'
    },
    site: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisessites'
    },
}, {
    timestamps: true
});


const MoruEnterprisesMealCharges = mongoose.model('MoruEnterprisesMealCharges', MealChargesSchema);

module.exports = MoruEnterprisesMealCharges