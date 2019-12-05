const mongoose = require ('mongoose');

mongoose.connect('mongodb://localhost:27017/targetDB',{ useNewUrlParser: true,useUnifiedTopology: true }, (err) => {
    if (!err) { console.log('MongoDB connection Success.') }
    else { console.log('Error in DB Connection : ' + err) }
});

require ('../models/target.model');