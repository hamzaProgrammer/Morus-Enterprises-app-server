const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    workerId: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesworkers'
    },
    site: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisessites'
    },
    dateStart: {
        type: String,
        required: true,
    },
    dateEnd: {
        type: String,
        required: true,
    },
    presentDays: {
        type: Number,
        required: true,
    },
    overTime: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    grossWage: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        required: true,
    },
    homeAdvances: {
        type: Number,
    },
    allowances: {
        type: Number,
    },
    netWage: {
        type: Number,
        required : true
    },
}, {
    timestamps: true
});


const MoruEnterprisesReports = mongoose.model('MoruEnterprisesReports', ReportSchema);

module.exports = MoruEnterprisesReports