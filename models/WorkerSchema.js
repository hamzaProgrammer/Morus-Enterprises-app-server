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
        enum : ['daily wage', 'monthly', 'weekly']
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
    paidOn: {
        type: String,
        default : '',
    },
    isPaid: {
        type: Boolean,
        default : 'false',
    },
    lastActive: {
        type: String,
        default : ''
    },
    lastActiveMonthYear: {
        type: String,
        default : ''
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
    profilePic: {
        type: String,
        default : ''
    },
    activeStatus: {
        type: Boolean,
        default : 'true'
    },
    lastPaidDate: {
        type: String,
        default : ''
    }
}, {
    timestamps: true
});


const MoruEnterprisesWorkers = mongoose.model('MoruEnterprisesWorkers', WorkersSchema);

module.exports = MoruEnterprisesWorkers