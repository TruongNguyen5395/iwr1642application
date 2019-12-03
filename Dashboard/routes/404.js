var express = require('express');
var router=express.Router();

router.get("*",(req,res)=>{
    res.render("./404.ejs");
});

module.exports=router;