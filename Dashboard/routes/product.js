const express = require("express");
const router = express.Router();
const localtion = require("../models/localtion");
const user = require("../models/user");

var classLocation = require("../classLocation");
var toado_tag = new classLocation();

router.post("/", (req, res) => {
    localtion.find({ node_id: "152a" }, (err, result) => {
        toado_tag.xcale = result[0]["coordinate"]["xcale"];
        toado_tag.ycale = result[0]["coordinate"]["ycale"];
    });
    res.send({xcale: toado_tag.xcale, ycale: toado_tag.ycale});
})


module.exports = router;