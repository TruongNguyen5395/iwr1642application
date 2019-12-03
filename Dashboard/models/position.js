const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true
  },
  
  x:{
      type: Number,
      required: true
  },
  
  y:{
      type : Number,
      required: true
  }
});

const location = mongoose.model('location', LocationSchema);

module.exports = location;
