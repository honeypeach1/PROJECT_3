var express = require('express');
var cors = require('cors');
var router = express.Router();

var csurf = require('csurf')
    , csrfProtection = csurf({cookie: true});

var passport = require('passport');

const mariaDB = require('maria');
const db = require("../../config/database");
const dbconnect = mariaDB.createConnection(db.mariaConfig);

/*router.use(cors({
    origin:'/api/loginCheck',
    credential:true,
}));*/

//쿠키 보증 기간 설정
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 7) //24 hour 7일

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.route('/:csrf').get(csrfProtection, function (req,res,next){
    return res.render('/monitoring',{csrfToken:req.csrf_token()});
})

//로그인 체크
router.post('/loginCheck', function (req, res) {
    console.log("로그인 아이디 : ", req.body.login_id)
    console.log("로그인 패스워드 : ", req.body.login_pass)
    console.log("csrf_token : ", req.csrf_token)

    var exec = dbconnect.query('SELECT MEMBER_ID, MEMBER_NAME FROM MEMBER WHERE MEMBER_ID = ? AND MEMBER_PASS = ?',
        [req.body.login_id, req.body.login_pass], function (err, rows) {
            if (err) throw err;
            if (rows.length > 0) {
                console.log('로그인 성공');
                res.cookie('loginCookie', rows, {
                    expires: expiryDate,
                    httpOnly: true,
                    signed: true
                })

                return;
            } else {
                console.log("계정 정보가 일치 하지 않습니다.")

                return;
            }
        })

    return res.status(200).json({
        message: '통신 성공',
    })
})

//로그아웃
router.get('/logout',function(req,res){
    res.clearCookie("loginCookie");

    console.log("로그아웃 실행")
    res.redirect("/")
})

module.exports = router;