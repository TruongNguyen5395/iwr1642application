require('./config/key1');

const express = require("express");
const app = express();
const server = require("http").Server(app);
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const io = require("socket.io")(server);
//EJS
app.set("views", "./views");
app.set("view engine", "ejs");
//mmWAVE
const mongoose = require('mongoose');
const Location = mongoose.model('location');
const Temp = mongoose.model('temp')
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

var numberInDB
//-------------------------------------------------------------------//
//---------------------------CloudMQTT-------------------------------//
//-------------------------------------------------------------------//

//const targetController = require('./config/targetController');

//app.use('/location', targetController);

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


var arr1 = new Array(20).fill(0);
var arr2 = new Array(20).fill(0);
var arr3 = new Array(20).fill(0);

let countIn  = 0;
let countOut = 0;

// setInterval(()=>{
//   countIn = 0;
// },86400)


function mqtt_messsageReceiv(topic, message, packet) {
  var stringBuf = JSON.stringify(message.toString());
  // try {
  //console.log(stringBuf);
  var json1 = stringBuf.replace(/"\[|\]"/gi, '');
  var dataresult = JSON.parse("[" + json1 + "]");

  myId = dataresult[0];
  myX = dataresult[1];
  myY = dataresult[2];

  // for (count = 0; count < myId.length; count++) {
  //   if (myY[count] <= 1) {
  //     Temp.update({tid : tid[count],})
  //     }
    
  myId.map((value,index)=>{
 
    // arr[value] = myY[index];
    let y = myY[index]
    if(y<=1){
      if(arr2[value]===1 && arr3[value]===1){
        countOut++ ;
        arr2[value]=0;
        arr3[value]=0;
      }else if(arr2[value]===1 && arr3[value]===0){
        arr2[value]=0;
        arr1[value] =0;
      }else{
        arr1[value] =1
      }
    }else if(y >1 && y< 2){
      arr2[value] = 1;
    }else if(y >=2){
      if(arr2[value]===1 && arr1[value]===1){
        countIn++;
        arr2[value]=0;
        arr1[value] =0;
      }else if(arr2[value]===1 && arr1[value]===0){
        arr2[value]=0;
        arr3[value] =0;
      }else{
        arr3[value] =1;
      }
    }
    
  })
  console.log(countIn,countOut)
}




// Temp.count({ tid: { $exists: true, $in: myId[count] } }, function (err, number) {
//   numberInDB = number;
//   // console.log('number in idDB ' + numberInDB)
// })
// if (numberInDB == 0) {
//   // console.log('Id va y sau khi check count: ' + myId[count] + '  ' + myY[count]);
//   setTimeout(() => {
//     insertTemp(myId[count], myY[count]);
//     console.log('Insert: ' + myId[count]);
//   }, timeout);

// } else {
//   console.log('number in idDB ********* ' + numberInDB)
// }

// console.log(myId);
// console.log(myX);
// console.log(myY);




//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/


io.on('connection', socket => {
  io.sockets.emit('data-sent', { a1: myId, a2: myX, a3: myY ,a4: countIn});
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

// function insertTemp(d, e) {

//   var temp = new Temp();
//   temp.tid = JSON.stringify(d);
//   temp.yAxis = JSON.stringify(e);

//   temp.save((err, doc) => {
//     if (!err)
//       console.log("Inserted temp");
//     else {
//       console.log('Error During recprd insert: ' + err);
//     }
//   });
// }
//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/
//-----------------------------------------------------------------------/




app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Express body parser
app.use(express.urlencoded({ extended: true }));

//DB Config
const db = require('./config/keys').mongoURI;
const db1 = require('./config/key1').mongoURI;

//connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// setup public folder
app.use(express.static("public"));

// -------------setup routes-----------------


app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));
app.use("/localtion", require("./routes/localtion.js"));
app.use("/product", require("./routes/product.js"));
app.use("*", require("./routes/404"));
//app.use("/dashboarrd", require("./routes/dashboard.js"));

const PORT = process.env.PORT || 3000;

server.listen(
  PORT,
  console.log("Server is running at 3000")
);



//---------------
