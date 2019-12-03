const mongoose = require('mongoose');

const localtionSchema = new mongoose.Schema({
    node_id: { type: String, require: true },
    coordinate: {
        xcale: {type: Number, require: true },
        ycale: {type: Number, require: true }
    },
    date:{type: Date, default: Date.now}
});

const localtion = mongoose.model("localtion",localtionSchema,"localtion");

module.exports = localtion;
