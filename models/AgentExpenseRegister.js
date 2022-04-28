const mongoose = require("mongoose");

const AgentCashRegisterSchema = new mongoose.Schema({
    worker: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesworkers'
    },
    agent: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesagents'
    },
    amount: {
        type: Number,
        default : 0,
    },
    date: {
        type: Date,
        required : true
    },
}, {
    timestamps: true
});


const MoruEnterprisesAgentCashRegister = mongoose.model('MoruEnterprisesAgentCashRegister', AgentCashRegisterSchema);

module.exports = MoruEnterprisesAgentCashRegister