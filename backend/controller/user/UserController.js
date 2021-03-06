/*유저 처리 컨트롤러 통합*/
/*DB 연동*/
/*
const mariaDB = require('maria');
const db = require("../../config/database");
const dbConnect = mariaDB.createConnection(db.mariaConfig);

let connection;
//DB 연결 끊어졌을시 재연결 처리
function handleDisconnect() {
    connection = mariaDB.createConnection(dbConnect);
}
*/

let dbConfig = require("../../config/database");
let connection;
connection = dbConfig.dbconn(connection);

const crypto = require('crypto');
const path = require("path");
const secret = require("../../config/crypto");
const jwt = require('../../modules/jwt');
const {token} = require("morgan");
const useragent = require('express-useragent');
const {log} = require("debug");
const {raw} = require("body-parser");

//쿠키 보증 기간 설정
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 3) //24 hour 3일

const userCon = {
    /*
        1. 로그인 체크 메소드
    */
    loginCheck: (req, res) => {
        let login_check = null;
        let login_ip = req.connection.remoteAddress.replace(/^.*:/, '');
        let login_Agent = req.headers['user-agent'];
        let member_seq = 0;
        try {
            //먼저 로그인할 계정이 있는지 확인하고 있으면 salt값을 가져옴.
            connection.query('SELECT MEMBER_SEQ, MEMBER_ID, SALT FROM MEMBER WHERE MEMBER_ID = ?', req.body.login_id,
                async function (err, val) {
                    if (err) console.log("DataBase Query Error : ", err);
                    //로그인한 아이디가 존재하며 존재하는 salt값을 가져옴.
                    if (val != '') {
                        var dataList = [];
                        for (let data of val) {
                            member_seq = data.MEMBER_SEQ;

                            dataList.push(data.MEMBER_ID);
                            dataList.push(data.SALT);
                        }

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
                        connection.query('SELECT MEMBER_SEQ, MEMBER_RELES, MEMBER_ID, MEMBER_NAME FROM MEMBER WHERE MEMBER_ID = ? AND MEMBER_PASS = ?',
                            [req.body.login_id, decryption.salt], async function (err, data) {
                                if (err) console.log("DataBase Query Error : ", err);
                                //암호가 일치하는 유저가 있음.
                                if (data.length > 0) {
                                    login_check = await login_log('0');
                                    var dataList = [];
                                    for (var value of data) {
                                        dataList.push(value.MEMBER_ID);
                                        dataList.push(value.MEMBER_NAME);
                                        dataList.push(value.MEMBER_RELES);
                                    }

                                    //해당 파트 확인 요망
                                    req.session.user_cookie = dataList;

                                    //res.isAuthenticated(data)
                                    const jwtToken = await jwt.sign(dataList);
                                    //쿠키 설정
                                    /*
                                        cookie 생성시 받는 파라미터는 로그인시 받는 발급 토큰과 refresh 토큰으로
                                        보안상의 3가지 토큰 저장 방법이 있음.
                                        1. 세션 - 세션 쿠키로 세션 종료시 삭제(5 ~ 10MB)
                                        2. 쿠키 - HttpOnly 설정으로 javascript 접근 차단(XSS) but CSRF 공격 노출 우려
                                        3. 로컬 - 로컬스토리지로 서버 접근은 안되지만 반 영구적인 저장 가능, Persistent cookies와 비슷(5 ~ 10MB)
                                        XSS 공격 방어가 가능한 만큼 쿠키를 이용한 방법이 좀더 좋음
                                     */

                                    res.cookie('x-auth', jwtToken, {
                                        expires: expiryDate,
                                        httpOnly: true, //http 통신
                                        //secure: true //https 통신
                                    })

                                    res.json({
                                        success: true,
                                        token: jwtToken.token,
                                        user_info: dataList[1],
                                        message: '로그인에 성공하였습니다.'
                                    })
                                    return res;
                                } else {
                                    login_check = await login_log('1');

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
                    } else {
                        login_check = await login_log('2');

                        return res.json({
                            success: false,
                            message: '로그인 정보를 가져올 수 없습니다. 아이디와 패스워드를 다시 입력해주세요.'
                        })
                    }
                });

            let login_log = async (success) => {
                await connection.query('INSERT INTO LOGIN_LOG (MEMBER_SEQ, LOGIN_LOG_IP, LOGIN_LOG_AGENT, LOGIN_LOG_SUCCESS) ' +
                    'VALUES (?,?,?,?);',
                    [
                        member_seq,
                        login_ip,
                        login_Agent,
                        success,
                    ],
                    function (err) {
                        if (err) console.log("DataBase Query Error : ", err);
                    })
            }

        } catch (err) {
            console.log("DB Connection Error!", err)
        }
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
            try {
                connection.query('SELECT MEMBER_ID FROM MEMBER WHERE MEMBER_ID = ?',
                    req.body.register_id, function (err, rows) {
                        //일치하는 아이디가 없음.
                        if (rows.length == 0) {
                            connection.query('INSERT INTO MEMBER (MEMBER_ID, MEMBER_PASS, SALT, MEMBER_NAME, MEMBER_TEL, MEMBER_RELES, MEMBER_MAP_LAT, MEMBER_MAP_LNG) ' +
                                'VALUES (?,?,?,?,?,?,?,?);',
                                [req.body.register_id,
                                    pwd,
                                    salt,
                                    req.body.register_name,
                                    req.body.register_tel,
                                    req.body.register_role,
                                    '126.000',
                                    '126.000'
                                ],
                                function (err, rows) {
                                    if (err) console.log("DataBase Query Error : ", err);
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
            } catch (err) {
                res.json({
                    success: false,
                    message: '회원가입 오류가 발생하였습니다. 잠시후 다시 시도하세요.'
                })
            }
        }
    },

    //3. 유저 정보 가져오기
    getUserInfor: (req, res) => {
        connection.query('SELECT MEMBER_SEQ, MAP_TYPE_SEQ, MEMBER_ID, MEMBER_NAME, MEMBER_TEL, MEMBER_CK, MEMBER_RELES,' +
            'MEMBER_MAP_LAT, MEMBER_MAP_LNG, MEMBER_MAP_ZOOM_SIZE, DATE_FORMAT(MEMBER_REG_DATE,"%y-%m-%d") AS MEMBER_REG_DATE FROM MEMBER',
            function (err, data) {
                if (err) console.log("DataBase Query Error : ", err);
                let userInfor = data;
                if (data.length == 0) {
                    res.json({
                        success: false,
                        message: '유저 정보가 없습니다.'
                    })
                } else {
                    res.json({
                        success: true,
                        userInfor: userInfor,
                        message: '유저 목록을 조회하였습니다.'
                    })
                }
            })
    },

    //4. 유저 패스워드 변경
    setUserPass: async (req, res) => {

        //salt 단방향 암호화(암호화 가능, 복호화 불가)
        //randomBytes로 64바이트 길이의 salt를 생성해줌. buf 버퍼 형식으로 base64 문자열로 salt 변경, pbkdf2 단뱡향 암호화
        const hash = await secret.CRYPTO(req.body.update_pass);
        const pwd = hash.pwd, salt = hash.salt;

        connection.query('UPDATE MEMBER SET MEMBER_PASS = ?, salt = ? WHERE MEMBER_SEQ = ?',
            [
                pwd,
                salt,
                req.body.member_seq
            ],
            function (err, data) {
                if (err) console.log("DataBase Query Error : ", err);
                console.log("data : ", data);
            })
    },

    //5. 로그아웃
    userLogout: (req, res) => {
        req.session.destroy();
        res.clearCookie('user_cookie');
        res.clearCookie('x-auth');
        res.json({
            message: '로그아웃 되었습니다.'
        })
    }
}
module.exports = userCon;