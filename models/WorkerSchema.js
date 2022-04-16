const mongoose = require("mongoose");

const WorkersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    allowance: {
        type: Number,
        required: true,
    },
    homeAdvance: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    accountNo: {
        type: Number,
        required: true,
    },
    ifsc: {
        type: String,
        required: true,
    },
    agent: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesagents',
        required: true,
    },
    owner: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesadmins',
        required: true,
    },
    site: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisessites',
        required: true,
    },
    activeStatus: {
        type: Boolean,
        default : 'true'
    },
}, {
    timestamps: true
});


const MoruEnterprisesWorkers = mongoose.model('MoruEnterprisesWorkers', WorkersSchema);

module.exports = MoruEnterprisesWorkers