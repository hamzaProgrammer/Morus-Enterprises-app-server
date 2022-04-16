const mongoose = require("mongoose");

const SitesSchema = new mongoose.Schema({
    siteName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    owner: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesadmins'
    },
    mealCharges: {
        type: Number,
        default : '0',
    },
    siteAdvances: {
        type: Number,
        default : '0',
    },
}, {
    timestamps: true
});


const MoruEnterprisesSites = mongoose.model('MoruEnterprisesSites', SitesSchema);

module.exports = MoruEnterprisesSites