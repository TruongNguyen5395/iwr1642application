const express = require("express");
const app = express();
const server = require("http").Server(app);
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require("mongoose");
const io = require("socket.io")(server);
//EJS
app.set("views", "./views");
app.set("view engine", "ejs");

// user.showUser((err,data)=>{
// 	console.log(data);
// })

// location.create({
// 	tag: "aa02",
// 	location: {
// 		xcale: 14.5,
// 		ycale: 34
// 	}
// }, (err, doc) => {
// 	if (err) throw err;
// })

// io.on("connection", socket => {
//   location.find({ tag: "aa02" }, (err, res) => {
//     if (err) throw err;
//     socket.emit("mongo", res);
//   });
//   user.showUser((err, data) => {
//     if (err) throw err;
//     socket.emit("database", data);
//   });
//   socket.emit("testAjax", Math.random());
// });

//------------------ session-------------//
// app.use(session({
//   secret: 'secret',
//   resave: true,
//   saveUninitialized: true
// }))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


//-----------------socket io -------------------------------//
io.on("connection", (socket) => {
  socket.on("data-send", (data)=>{
    io.sockets.emit("data-send-from-server",data);
  })
  socket.on("data-send1", (data) =>{
    io.sockets.emit("data-send-from-server1",data)
  })
  socket.on("data-send2", (data) =>{
    io.sockets.emit("data-send-from-server2",data)
  })
  socket.on("data-send3", (data) =>{
    io.sockets.emit("data-send-from-server3",data)
  })
})
//--------------------------passport config------------------
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Express body parser
app.use(express.urlencoded({ extended: true }));

//DB Config
const db = require('./config/keys').mongoURI;
//const db1 = require('./config/key1').mongoURI;
//Connect to Mongo
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


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
app.use("/localtion", require("./routes/localtion.js"))
app.use("/product", require("./routes/product.js"))
app.use("*", require("./routes/404"));
//app.use("/dashboarrd", require("./routes/dashboard.js"));

const PORT = process.env.PORT || 3000;

server.listen(
  PORT,
  console.log("Server is running at 3000")
);
