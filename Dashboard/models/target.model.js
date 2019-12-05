const mongoose = require('mongoose');

var targetSchema = new mongoose.Schema({
    
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

module.exports = mongoose.model('location', targetSchema);

