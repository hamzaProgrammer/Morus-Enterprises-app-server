const mongoose = require("mongoose");

const AgentsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    owner: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesadmins'
    },
    cashGiven: {
        type: Number,
        default : '0',
    },
    expenses: {
        type: Number,
        default : '0',
    },
    balance: {
        type: Number,
        default : '0',
    },
}, {
    timestamps: true
});


const MoruEnterprisesAgents = mongoose.model('MoruEnterprisesAgents', AgentsSchema);

module.exports = MoruEnterprisesAgents