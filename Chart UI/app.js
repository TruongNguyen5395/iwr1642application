require('./models/db');

var express = require('express');
var hbs = require('hbs');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
//const EventEmitter = require ('events');
//const event = new EventEmitter()

var http = require('http');//.Server(app);
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

// var router = express.Router();
const mongoose = require('mongoose');
const Location = mongoose.model('location');





//-------------------------------------------------------------------//
//---------------------------CloudMQTT-------------------------------//
//-------------------------------------------------------------------//

var mqtt = require('mqtt');
var Topic = '#';   // Sub to any topic
var err = Error
var options = {
    port: 11141,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'spoeosqs',
    password: 'ac_554KtH4Gr',
    keepalive: 60,
    reconnectPeriod: 1000,
    clean: true,
    encoding: 'utf8'
};
var client = mqtt.connect('mqtt://soldier.cloudmqtt.com', options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceiv);
client.on('close', mqtt_close);

function mqtt_connect() {
    console.log("App Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, grant) {
    console.log("App Subcribed to " + Topic);
    if (err) { console.log(err); }
}

function mqtt_reconnect(err) {
    console.log("App Reconnect MQTT");
    if (err) { console.log(err); }
    client = mqtt.connect('mqtt://soldier.cloudmqtt.com', options);
}

function mqtt_error(err) {
    console.log("App Error!");
    if (err) { console.log(err); }
}

function mqtt_close() {
    console.log("Close MQTT");
}

var myId;
var myX;
var myY;

function mqtt_messsageReceiv(topic, message, packet) {
    var stringBuf = JSON.stringify(message.toString());
    // try {
    //console.log(stringBuf);
    var json1 = stringBuf.replace(/"\[|\]"/gi, '');
    var dataresult = JSON.parse("[" + json1 + "]");

    myId = dataresult[0];
    myX = dataresult[1];
    myY = dataresult[2];

    console.log(myId);
    console.log(myX);
    console.log(myY);

}

//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/


io.on('connection', socket => {
    io.sockets.emit('data-sent', { ak: "LOVE", a1: myId, a2: myX, a3: myY });
    // console.log('io'+ myId);
    // console.log('io' + myX);
    // console.log('io' + myY);
    insertRecord(myId, myX, myY);
});

//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/

function insertRecord(a, b, c) {

    var location = new Location();
    location.tid = JSON.stringify(a);
    location.xAxis = JSON.stringify(b);
    location.yAxis = JSON.stringify(c);

    location.save((err, doc) => {
        if (!err)
            console.log("Inserted to Database"); // res.redirect('/location/list'); 
        else {
            console.log('Error During recprd insert: ' + err);
        }
    });
}

//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/

const targetController = require('./controllers/targetController');


app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/views'));
app.use(bodyparser.json());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/target/' }));



app.get('/', (req, res, next) => {
    res.render("target/AddOrEdit"/* , { */);
    //viewTitle : "Visualize Data"
    //  met: K.toString()
});

server.listen(3000, () => {
    console.log('Express server started at port : 3000');
});


app.use('/location', targetController);
//app.use ('/', targetController);