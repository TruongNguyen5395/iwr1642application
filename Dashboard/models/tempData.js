const mongoose = require('mongoose');

var tempSchema = new mongoose.Schema({
    tid: {
        type: String
    },
    yAxis: {
        type: String
    },
    tag:{
        type: String
    }
});

module.exports = mongoose.model('temp', tempSchema);

