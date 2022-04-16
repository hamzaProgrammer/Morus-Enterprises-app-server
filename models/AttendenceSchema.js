const mongoose = require("mongoose");

const AttendenceSchema = new mongoose.Schema({
    isPresent: {
        type: Boolean,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    overTime: {
        type: String,
        required: true,
    },
    worker: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesworkers',
    },
    owner: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisesadmins',
    },
    site: {
        type : mongoose.Types.ObjectId,
        ref : 'moruenterprisessites',
    },
}, {
    timestamps: true
});


const MoruEnterprisesAttendences = mongoose.model('MoruEnterprisesAttendences', AttendenceSchema);

module.exports = MoruEnterprisesAttendences