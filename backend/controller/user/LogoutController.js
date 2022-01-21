var express = require("express");
var router = express.Router();

//로그아웃
router.get('/',function(req,res){
    res.clearCookie("loginCookie");

    console.log("로그아웃 실행")
    res.redirect("/")
})

module.exports = router;