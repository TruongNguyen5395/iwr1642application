const express = require("express");
const router = express.Router();
const localtion = require("../models/localtion");
//const user = require("../models/user");

router.get("/", (req, res) => {
    let id = req.query.id ;
    let xcale = req.query.xcale;
    let ycale = req.query.ycale;
    let query = { node_id: id };
    localtion.find(query, (err, result) => {
        if(err) throw err;
        if(result[0] != undefined ){
            let update = {coordinate: {xcale: xcale, ycale: ycale}};
            if(isNaN(xcale) || isNaN(ycale)){
                console.log("ERROR!!! insert data !!!")
            } else {
                localtion.findOneAndUpdate(query,update, (err, result) =>{
                    if(err) throw err;
                    console.log("SUCCESSFUL!!! insert data !!!")
                })
            }
        }
    })  
    res.send("code running")
})

module.exports = router;