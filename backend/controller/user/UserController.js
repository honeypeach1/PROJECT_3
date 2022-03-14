/*유저 처리 컨트롤러 통합*/
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../../config/database");
const dbConnect = mariaDB.createConnection(db.mariaConfig);
//////////
const crypto = require('crypto');
const path = require("path");
const secret = require("../../config/crypto");

//쿠키 보증 기간 설정
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 3) //24 hour 3일

const userCon = {
    /*
        1. 로그인 체크 메소드
    */
    loginCheck: (req, res) => {
        //먼저 로그인한 계정이 있는지 확인하고 있으면 salt값을 가져옴.
        dbConnect.query('SELECT MEMBER_ID, SALT FROM MEMBER WHERE MEMBER_ID = ?',req.body.login_id,
            function(err,val){
            if(err) throw err;
            //로그인한 아이디가 존재하며 존재하는 salt값을 가져옴.
            if(val != null){
                var dataList = [];
                for (var data of val){
                    dataList.push(data.MEMBER_ID);
                    dataList.push(data.SALT);
                };
                /*
                단방향 입력 패스워드 암호화 처리 후 로그인한 계정 비교
                로그인으로 입력한 패스워드와 입력한 아이디가 존재할때 해당 아이디의 salt값을 가져와서 서로
                동일한 암호화 알고리즘을 실행하여 패스워드 값을 decryption에 리턴함.
                해당 패스워드 값과 로그인으로 입력한 아이디와 동시에 일치하면 로그인 성공.
                    param1 -> 입력 password
                    param2 -> 조회된 salt값
                    return 암호값
                */
                const decryption = secret.DECRYPTO(req.body.login_pass, dataList[1]);
                dbConnect.query('SELECT MEMBER_SEQ, MEMBER_NAME FROM MEMBER WHERE MEMBER_ID = ? AND MEMBER_PASS = ?',
                    [req.body.login_id, decryption.salt], function (err, data) {
                        if (err) throw err;
                        //암호가 일치하는 유저가 있음.
                        if (data.length > 0) {
                            var dataList = [];
                            for (var value of data){
                                dataList.push(value.MEMBER_NAME);
                            };

                            //해당 파트 확인 요망
                            req.session.user_cookie = dataList;
                            //쿠키 설정
                            res.cookie('user_cookie', data, {
                                expires: expiryDate,
                                path: '/static',
                                httpOnly: true, //http 통신
                                //secure: true //https 통신
                            })
                            //res.isAuthenticated(data)
                            res.json({
                                success: true,
                                user_name: dataList,
                                message: '로그인에 성공하였습니다.'
                            })

                            return res;
                        } else {
                            res.json({
                                success: false,
                                message: '일치하는 회원 정보가 없습니다. 아이디와 패스워드를 다시 입력해주세요.'
                            });
                            return res;
                        }
                    })
                /*return res.status(200).json({
                    message: '통신 성공',
                })*/
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
        req.session.destroy();
        res.clearCookie('user_cookie');
        res.json({
            message: '로그아웃 되었습니다.'
        })
    }
}
module.exports = userCon;