/*통계 자료 컨트롤러 통합*/
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../../config/database");
const dbConnect = mariaDB.createConnection(db.mariaConfig);

let connection;
//DB 연결 끊어졌을시 재연결 처리
function handleDisconnect() {
    connection = mariaDB.createConnection(dbConnect);
}

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
        /*
              전달 파라미터
              1. start_date: 시작 시간,
              2. end_date: 종료 시간,
              3. isAlarm: 알람 체크 여부,
              4. dataType: 1분 평균 -> 0 , 5분 평균 -> 1 , 10분 평균 -> 2 , 1시간 평균 -> 3 , 1일 평균 -> 4,
              5. equipNum: 장비 번호
         */
        let user_info = req.session.user_cookie;
        /*세션을 확인함. 세션이 끊기면 로그인 페이지로*/
        /*if (user_info != null) {
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
        }*/
        //Select View Alarm Data.
        if (req.query.isAlarm == true) {
            //Get Alarm table into Parameter
            dbConnect.query('SELECT ' +
                'Data_Date_Time DataDateTime, ' +
                'sensor_signal_data_tod TOD, ' +
                'sensor_signal_data_tod todValue, ' +
                'sensor_signal_data_h2s H2S, ' +
                'sensor_signal_data_nh3 NH3, ' +
                'sensor_signal_data_voc VOC, ' +
                'sensor_signal_data_mos MOS, ' +
                'sensor_signal_data_owd OWD, ' +
                'sensor_signal_data_ows OWS, ' +
                'sensor_signal_data_ott OTT, ' +
                'sensor_signal_data_oth OTH, ' +
                'sensor_signal_data_btv BTV ' +
                'FROM sensor_component WHERE data_date_time BETWEEN ? AND ? AND equipment_seq = ? AND sensor_component_period_type = ?',
                [
                    req.query.start_date,
                    req.query.end_date,
                    req.query.equipNum,
                    req.query.dataType
                ],
                function (err, data) {
                if (err) {
                    console.log("DataBase Query Error : ", err);
                    setTimeout(handleDisconnect, 2000);
                }
                if (data != null) {
                    //json 데이터화
                    res.json({
                        success: true,
                        user_info: user_info[1],
                        tableData: data,
                        message: '일치하는 알람 데이터 조회에 성공하였습니다.'
                    })
                } else {
                    res.json({
                        success: false,
                        user_info: user_info[1],
                        tableData: data,
                        message: '일치하는 알람 데이터 정보가 없습니다.'
                    })
                }
            })

        //Select View Normal(non-Alarm) Data.
        } else {
            //Get Normal(non-Alarm) table into Parameter
            dbConnect.query('SELECT ' +
                'DATE_FORMAT(data_date_time,"%y-%m-%d %H:%i:%s") DataDateTime, ' +
                'FLOOR(sensor_signal_data_tod) TOD, ' +
                'IFNULL(sensor_signal_data_tod,"NULL") todValue, ' +
                'IFNULL(sensor_signal_data_h2s,"NULL") H2S, ' +
                'IFNULL(sensor_signal_data_nh3,"NULL") NH3, ' +
                'IFNULL(sensor_signal_data_voc,"NULL") VOC, ' +
                'IFNULL(FLOOR(sensor_signal_data_mos),"NULL") MOS, ' +
                'IFNULL(sensor_signal_data_owd,"NULL") OWD, ' +
                'IFNULL(sensor_signal_data_ows,"NULL") OWS, ' +
                'IFNULL(sensor_signal_data_ott,"NULL") OTT, ' +
                'IFNULL(sensor_signal_data_oth,"NULL") OTH, ' +
                'IFNULL(sensor_signal_data_btv,"NULL") BTV ' +
                'FROM sensor_component WHERE data_date_time BETWEEN ? AND ? AND equipment_seq = ? AND sensor_component_period_type = ?',
                [
                    req.query.start_date,
                    req.query.end_date,
                    req.query.equipNum,
                    req.query.dataType
                ],
                function (err, data) {
                    if (err) {
                        console.log("DataBase Query Error : ", err);
                        console.log("Trying to reConnection")
                        setTimeout(handleDisconnect, 2000);
                    }
                if (data != '') {
                    //json 데이터화
                    res.json({
                        success: true,
                        tableData: data,
                        user_info: user_info[1],
                        message: '일치하는 일반 데이터 조회에 성공하였습니다.'
                    })
                } else {
                    res.json({
                        success: false,
                        tableData: data,
                        user_info: user_info[1],
                        message: '일치하는 일반 데이터 정보가 없습니다.'
                    })
                }
            })
        }
    },
    getRegister: (req, res) => {
        dbConnect.query('SELECT * FROM EQUIPMENT_INFO WHERE EQUIPMENT_TCP_PORT = ?', req.body.equipment_port,
            function (err, val) {
                if (err) {
                    console.log("DataBase Query Error : ", err);
                    console.log("Trying to reConnection")
                    setTimeout(handleDisconnect, 2000);
                }
                //포트 넘버는 중복되면 안됨. 포트 넘버 확인하는 로직
                if (val.length == 0) {
                    //일치하는 포트 넘버가 없으면 정상적으로 INSERT 수행
                    dbConnect.query('INSERT INTO EQUIPMENT_INFO (EQUIPMENT_TYPE_SEQ, EQUIPMENT_LAT, EQUIPMENT_LNG, EQUIPMENT_NAME, EQUIPMENT_INSTALL_PLACE ,EQUIPMENT_INSTALL_COMPANY, EQUIPMENT_TCP_PORT) VALUES (?,?,?,?,?,?,?);',
                        [req.body.equipment_type, req.body.equipment_lat, req.body.equipment_lng, req.body.equipment_name, req.body.equipment_address, req.body.equipment_company, req.body.equipment_port],
                        function (err) {
                            if (err) {
                                console.log("DataBase Query Error : ", err);
                                console.log("Trying to reConnection")
                                setTimeout(handleDisconnect, 2000);
                            }
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