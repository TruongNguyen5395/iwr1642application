const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Location = mongoose.model('location');



//-------------------------------------------------------------------//
//---------------------------CloudMQTT-------------------------------//
//-------------------------------------------------------------------//


// var mqtt = require('mqtt');
// var Topic = '#';   // Sub to any topic
// var err = Error
// var options = {
//     port: 11141,
//     clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
//     username: 'spoeosqs',
//     password: 'ac_554KtH4Gr',
//     keepalive: 60,
//     reconnectPeriod: 1000,
//     clean: true,
//     encoding: 'utf8'
// };
// var client = mqtt.connect('mqtt://soldier.cloudmqtt.com', options);
// client.on('connect', mqtt_connect);
// client.on('reconnect', mqtt_reconnect);
// client.on('error', mqtt_error);
// client.on('message', mqtt_messsageReceiv);
// client.on('close', mqtt_close);

// function mqtt_connect() {
//     console.log("App Connecting MQTT");
//     client.subscribe(Topic, mqtt_subscribe);
// }

// function mqtt_subscribe(err, grant) {
//     console.log("App Subcribed to " + Topic);
//     if (err) { console.log(err); }
// }

// function mqtt_reconnect(err) {
//     console.log("App Reconnect MQTT");
//     if (err) { console.log(err); }
//     client = mqtt.connect('mqtt://soldier.cloudmqtt.com', options);
// }

// function mqtt_error(err) {
//     console.log("App Error!");
//     if (err) { console.log(err); }
// }

// function mqtt_close() {
//     console.log("Close MQTT");
// }

// var myId;
// var myX;
// var myY;

// function mqtt_messsageReceiv(topic, message, packet) {
//     var stringBuf = JSON.stringify(message.toString());
//     // try {
//     //console.log(stringBuf);
//     var json1 = stringBuf.replace(/"\[|\]"/gi, '');
//     var dataresult = JSON.parse("[" + json1 + "]");
 
//     myId = dataresult[0];
//     myX = dataresult[1];
//     myY = dataresult[2];

//     console.log(myId);
//     console.log(myX);
//     console.log(myY);

// }

//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/


// io.on('connection', socket => {
//     io.sockets.emit('data-sent', {a1: myId, a2: myX, a3: myY });
//     console.log('io'+ myId);
//     console.log('io' + myX);
//     console.log('io' + myY);
// });

//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/


router.post('/', (req, res) => {
    insertRecord(req, res);
});


/* 
function insertRecord(req, res) {
    var location = new Location();
    location.tid = req.body.tid;
    location.xAxis = req.body.xAxis;
    location.yAxis = req.body.yAxis;
    location.save((err, doc) => {
        if (!err)
            res.redirect('/location/list');
        else {
            console.log ('Error During recprd insert: ' + err);
        }
    });
} */

// function insertRecord(a, b) {
//     if (a == 'tid') {
//         var location = new Location();
//         location.tid = b;
//         location.save((err, doc) => {
//             if (!err)
//                 console.log("Good Job");// res.redirect('/location/list'); 
//             else {
//                 console.log('Error During recprd insert: ' + err);
//             }
//         });

//     } else if (a == 'x') {
//         var location = new Location();
//         location.xAxis = b;
//         location.save((err, doc) => {
//             if (!err)
//                 console.log("Good Job");// res.redirect('/location/list'); 
//             else {
//                 console.log('Error During recprd insert: ' + err);
//             }
//         });

//     } else {
//         var location = new Location();
//         location.yAxis = b;
//         location.save((err, doc) => {
//             if (!err)
//                 console.log("Good Job");// res.redirect('/location/list'); 
//             else {
//                 console.log('Error During recprd insert: ' + err);
//             }
//         });
//     }
//     /* var location = new Location();
//     location.tid = a;
//     location.xAxis = b;
//     location.yAxis = c; */

// }


//let K = insertRecord()
router.get('/', (req, res, next) => {
    //let K = [0.582967, -1.5023281, 0.2468418];//mqtt_messsageReceiv();
    res.render("target/AddOrEdit"/* , { */
        //viewTitle : "Visualize Data"
      //  met: K.toString()


    );
});

router.get('/list', (req, res) => {
    Location.find((err, docs) => {
        if (!err) {
            res.render("target/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving target list :' + err);
        }
    });
});

module.exports = router;
