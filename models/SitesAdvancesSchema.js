const mongoose = require("mongoose");

const SiteAdvanceSchema = new mongoose.Schema({
    siteAdvance: {
        type: Number,
        default : '0'
    },
    date: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
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


const MoruEnterprisesSitesAdvances = mongoose.model('MoruEnterprisesSitesAdvances', SiteAdvanceSchema);

module.exports = MoruEnterprisesSitesAdvances