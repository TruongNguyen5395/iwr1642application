const mongoose = require('mongoose');

var targetSchema = new mongoose.Schema({
    // topic: {
    //     type: String
    // },
    // xydata: {
    //     type: String
    // }
    
    tid: {
        type: String
    },
    xAxis: {
        type: String
    },
    yAxis: {
        type: String
    }
});

var Userdb = mongoose.model('location', targetSchema);