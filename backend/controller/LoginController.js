var express = require('express');
var cors = require('cors');
var router = express.Router();

const mariaDB = require('maria');
const db = require("../config/database");
const dbconnect = mariaDB.createConnection(db.mariaConfig);

/*router.use(cors({
    origin:'/api/loginCheck',
    credential:true,
}));*/

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.post('/',function(req,res){
    console.log("로그인 아이디 : ",req.body.login_id)
    console.log("로그인 패스워드 : ",req.body.login_pass)
    console.log("csrf_token : ",req.csrf_token)

    var exec = dbconnect.query('SELECT MEMBER_ID, MEMBER_NAME FROM MEMBER WHERE MEMBER_ID = ? AND MEMBER_PASS = ?',
        [req.body.login_id,req.body.login_pass], function(err,rows) {

        if(err) throw err;
        if(rows.length > 0){
                console.log('로그인 성공');
                return true;
            }else{
                console.log("계정 정보가 일치 하지 않습니다.")
                return false;
            }
        })

    return res.status(200).json({
        message: '통신 성공',
    })
})

module.exports = router;