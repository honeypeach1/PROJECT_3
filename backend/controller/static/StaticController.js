/*통계 자료 컨트롤러 통합*/
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../../config/database");
const dbConnect = mariaDB.createConnection(db.mariaConfig);

const staticCon = {
    getPage: (req, res) => {
        let user_info = req.session.user_cookie;
        /*세션을 확인함. 세션이 끊기면 로그인 페이지로*/
        if (user_info != null) {
            res.json({
                success: true,
                user_info: user_info[1],
                message: '통계 탭으로 페이지 이동 합니다.'
            })
        } else {
            res.json({
                success: false,
                message: '세션이 만료되었습니다.'
            })
        }
    },
    getData: (req, res) => {
        let user_info = req.session.user_cookie;
        /*세션을 확인함. 세션이 끊기면 로그인 페이지로*/
        if (user_info != null) {
            res.json({
                success: true,
                user_info: user_info[1],
                message: '일치하는 알람 데이터 조회에 성공하였습니다.'
            })
        } else {
            res.json({
                success: false,
                message: '세션이 만료되었습니다.'
            })
        }

        //Select View Alarm Data.
        /*if (req.query.isAlarm == true) {
            //Get Alarm table into Parameter
            dbConnect.query('', req.query, function (err, data) {
                if (err) throw err;
                if (data != null) {

                    //json 데이터화


                    res.json({
                        success: true,
                        message: '일치하는 알람 데이터 조회에 성공하였습니다.'
                    })
                } else {
                    return res.json({
                        success: false,
                        message: '일치하는 알람 데이터 정보가 없습니다.'
                    })
                }
            })

        //Select View Normal(non-Alarm) Data.
        } else {
            //Get Normal(non-Alarm) table into Parameter
            dbConnect.query('', req.query, function (err, data) {
                if (err) throw err;
                if (data != null) {

                    //json 데이터화

                    res.json({
                        success: true,
                        message: '일치하는 일반 데이터 조회에 성공하였습니다.'
                    })
                } else {
                    return res.json({
                        success: false,
                        message: '일치하는 일반 데이터 정보가 없습니다.'
                    })
                }
            })

        }*/

    },
    getRegister: (req, res) => {
        dbConnect.query('SELECT * FROM EQUIPMENT_INFO WHERE EQUIPMENT_TCP_PORT = ?', req.body.equipment_port,
            function (err, val) {
                if (err) throw err;
                //포트 넘버는 중복되면 안됨. 포트 넘버 확인하는 로직
                if (val.length == 0) {
                    //일치하는 포트 넘버가 없으면 정상적으로 INSERT 수행
                    dbConnect.query('INSERT INTO EQUIPMENT_INFO (EQUIPMENT_TYPE_SEQ, EQUIPMENT_LAT, EQUIPMENT_LNG, EQUIPMENT_NAME, EQUIPMENT_INSTALL_PLACE ,EQUIPMENT_INSTALL_COMPANY, EQUIPMENT_TCP_PORT) VALUES (?,?,?,?,?,?,?);',
                        [req.body.equipment_type, req.body.equipment_lat, req.body.equipment_lng, req.body.equipment_name, req.body.equipment_address, req.body.equipment_company, req.body.equipment_port],
                        function (err) {
                            if (err) throw err;
                            res.json({
                                success: true,
                                message: '장비 등록이 완료되었습니다.'
                            })
                        })
                } else {
                    res.json({
                        success: false,
                        message: '존재하는 포트 번호 입니다. 다른 번호를 입력해주세요.'
                    })
                }
            })
    }
}

module.exports = staticCon;