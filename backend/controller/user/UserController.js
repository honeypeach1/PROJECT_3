/*유저 처리 컨트롤러 통합*/
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../../config/database");
const dbconnect = mariaDB.createConnection(db.mariaConfig);
//////////
const crypto = require('crypto');
const secret = require("../../config/cryptoKey").KEY.secret;
const {connect} = require("net");

//쿠키 보증 기간 설정
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 7) //24 hour 7일

/*router.route('/:csrf').get(csrfProtection, function (req,res,next){
    return res.render('/monitoring',{csrfToken:req.csrf_token()});
})*/

const userCon = {

//로그인 체크
    loginCheck: (req, res) => {
        console.log("데이터 체크 : ", req)
        dbconnect.query('SELECT MEMBER_ID, MEMBER_NAME FROM MEMBER WHERE MEMBER_ID = ? AND MEMBER_PASS = ?',
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
    },

    //회원가입
    registerUser: (req, res) => {
        const hash = crypto.createHmac('sha256',secret)
            .update(req.body.login_pass)
            .digest('base64');
        console.log("데이터 체크 : ", req)
        req.register_pwd = hash
        console.log("패스워드 암호화 : ", req.register_pwd)
        //model의 DTO 처리 user 클래스 변수 처리
        //user.user_id = req.body.login_id;
        //user.user_pass = req.body.login_pass;

        if(req.body.login_id && req.body.login_pass){
            dbconnect.query('SELECT MEMBER_ID FROM MEMBER WHERE MEMBER_ID = ?',
                req.body.login_id,function (err, rows){
                    //일치하는 아이디가 없음.
                    if(rows.length == 0){
                        //dbconnect.query('INSERT INTO MEMBER ')
                    //일치하는 아이디가 존재
                    }else{
                        alert('존재하는 아이디입니다. 다른 아이디를 사용하세요.')
                    }
                })
        }
    },

    //로그아웃
    userLogout: (req, res) => {
        res.clearCookie("loginCookie");
        console.log("로그아웃 실행")
        res.redirect("/")
    }
}
module.exports = userCon;