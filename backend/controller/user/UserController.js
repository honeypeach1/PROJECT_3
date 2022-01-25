/*유저 처리 컨트롤러 통합*/
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../../config/database");
const dbConnect = mariaDB.createConnection(db.mariaConfig);
//////////
const crypto = require('crypto');
const path = require("path");
const secret = require("../../config/crypto");
//const secret = require("../../config/crypto").KEY.secret;

//쿠키 보증 기간 설정
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 7) //24 hour 7일

/*router.route('/:csrf').get(csrfProtection, function (req,res,next){
    return res.render('/monitoring',{csrfToken:req.csrf_token()});
})*/

const userCon = {
    /*
        1. 로그인 체크 메소드
    */
    loginCheck: (req, res) => {
        //먼저 로그인한 계정이 있는지 확인하고 있으면 salt값을 가져옴.
        dbConnect.query('SELECT MEMBER_ID, SALT FROM MEMBER WHERE MEMBER_ID = ?',req.body.login_id,
        function(err,val){
            if(err) throw err;
            //로그인한 계정의 salt값이 있음.
            if(val != null){
                var dataList = [];
                for (var data of val){
                    dataList.push(data.MEMBER_ID);
                    dataList.push(data.SALT);
                };
                /*
                복호화 처리
                    param1 -> 입력 password
                    param2 -> 조회된 salt값
                    return 암호값
                */
                const decyption = secret.DECRYPTO(req.body.login_pass, dataList[1]);
                dbConnect.query('SELECT MEMBER_ID, MEMBER_NAME FROM MEMBER WHERE MEMBER_ID = ? AND MEMBER_PASS = ?',
                    [dataList[0], decyption], function (err, val) {
                        if (err) throw err;
                        //암호가 일치하는 유저가 있음.
                        if (val.length > 0) {
                            /*res.session.login_id = rows.MEMBER_ID;
                            req.session.save();*/
                            res.json({
                                success: true,
                                message: '로그인에 성공하였습니다.'
                            })
                            /*res.cookie('loginCookie', rows, {
                                expires: expiryDate,
                                httpOnly: true,
                                signed: true
                            })*/
                        } else {
                            res.json({
                                success: false,
                                message: '일치하는 회원 정보가 없습니다. 아이디와 패스워드를 다시 입력해주세요.'
                            });
                        }
                    })
                return res.status(200).json({
                    message: '통신 성공',
                })
            }else{
                return res.json({
                    success: false,
                    message: '로그인 정보를 가져올 수 없습니다. 아이디와 패스워드를 다시 입력해주세요.'
                })
            }
        });
    },

    /*
        2.회원가입 처리 메소드
        salt 암호화 처리시 처리 횟수가 100000으로 지정됨.(대략 1초대)
        해당 처리가 될때 까지 해당 함수는 비동기로 처리되어야함.

        동기식으로 처리되면 암호화 처리 시간이 되기전 DB insert로
        NULL로 들어감. 그래서 비동기식 async로 암호화 await 호출
    */
    registerUser: async (req, res) => {
         //salt 단방향 암호화(암호화 가능, 복호화 불가)
        //randomBytes로 64바이트 길이의 salt를 생성해줌. buf 버퍼 형식으로 base64 문자열로 salt 변경, pbkdf2 단뱡향 암호화
        const hash = await secret.CRYPTO(req.body.register_pwd);
        const pwd = hash.pwd, salt = hash.salt;

        //model의 DTO 처리 user 클래스 변수 처리
        if (req.body.register_id != null) {
            try{
                dbConnect.query('SELECT MEMBER_ID FROM MEMBER WHERE MEMBER_ID = ?',
                    req.body.register_id, function (err, rows) {
                        //일치하는 아이디가 없음.
                        if (rows.length == 0) {
                            dbConnect.query('INSERT INTO MEMBER (MEMBER_ID, MEMBER_PASS, SALT, MEMBER_NAME, MEMBER_TEL, MEMBER_RELES) ' +
                                'VALUES (?,?,?,?,?,?);',
                                [req.body.register_id,
                                    pwd,
                                    salt,
                                    req.body.register_name,
                                    req.body.register_tel,
                                    req.body.register_role],
                                function (err, rows) {
                                    if (err) throw err;
                                    res.json({
                                        success: true,
                                        message: '회원가입에 성공하였습니다. 로그인 페이지로 이동합니다.'
                                    })
                                })
                            //일치하는 아이디가 존재
                        } else {
                            res.json({
                                success: false,
                                message: '존재하는 아이디입니다. 다른 아이디를 사용하세요.'
                            })
                        }
                    })
            }catch (err){
                res.json({
                    success: false,
                    message: '회원가입 오류가 발생하였습니다. 잠시후 다시 시도하세요.'
                })
                console.log("회원가입 오류 : ",err)
            }
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