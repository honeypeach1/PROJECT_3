//서버 실행시 받아오는 정보
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

const cronTab = require('node-schedule');
const {dbconn} = require("../../config/database");

function scheduleTimeStamp() {
    var today = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString().replace('T', ' ').substring(0, 19);
}

cronTab.scheduleJob('30 * * * * *', function () {
    console.log("=============================================")
    console.log("스케줄러 동작 시간 : ",scheduleTimeStamp())
    console.log("=============================================")
    connection.query('select 1', (err, data) => {
            if (err) {
                console.log("스케줄러 동작 에러")
                dbConfig.dbconn(connection);
            }
        }
    )
});

//그룹화 설정 전연 함수
const groupBy = function (data, key) {
    if(data != null || data != undefined){
        return data.reduce(function (carry, el) {
            var group = el[key];
            if (carry[group] === undefined) {
                carry[group] = []
            }
            carry[group].push(el)
            return carry
        }, {})
    }
    return null;
}

const EquipmentCon = {
    //장비 셀렉트 리스트 가져오기(GET)
    getEquipmentThreshold: (req, res) => {
        try {
            /*
                            'SELECT a.equipment_name, b.* FROM equipment_info a JOIN' +
                            '(SELECT c.threshold_over_event_values_seq, c.equipment_seq, c.threshold_over_event_type_seq, ' +
                            'c.threshold_over_event_sensor, c.threshold_over_event_values, d.threshold_over_event_name ' +
                            'FROM threshold_over_event_values c JOIN threshold_over_event_type d ' +
                            'ON c.threshold_over_event_type_seq = d.threshold_over_event_type_seq) b ' +
                            'ON a.equipment_seq = b.equipment_seq',
            */
            let equipList = new Object();
            let lastList = new Array();
            let data = [];
            connection.query('SELECT ROW_NUMBER() OVER (ORDER BY a.EQUIPMENT_SEQ) AS ROW_NUM, a.EQUIPMENT_SEQ EQUIPMENT_SEQ, a.EQUIPMENT_NAME EQUIPMENT_NAME, b.EQUIPMENT_TYPE_SEQ EQUIPMENT_TYPE_SEQ ,b.EQUIPMENT_TYPE_NAME EQUIPMENT_TYPE_NAME ' +
                'FROM equipment_info a JOIN equipment_type b ON a.equipment_type_seq = b.equipment_type_seq',
                (err, equipment) => {
                    if (err) console.log("DataBase Query Error : ", err);
                    // const result = Object.values(JSON.parse(JSON.stringify(equpiment)));
                    if(equipment !== undefined || equipment !== null){
                        for (let list of equipment) {
                            equipList = {
                                type: list.EQUIPMENT_TYPE_NAME,
                                text: list.EQUIPMENT_NAME,
                                value: list.EQUIPMENT_SEQ,
                                rownum: list.ROW_NUM
                            }
                            lastList.push(equipList);
                        }
                    }
                    res.json({
                        success: true,
                        equipmentList: groupBy(lastList, 'type'),
                    })
                }
            )
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    //장비 별 센서(TOD) 경고, 주의 값 리스트 가져오기(GET)
    getThresholdDataList: (req, res) => {
        try {
            connection.query('SELECT ' +
                'ROW_NUMBER() OVER (ORDER BY b.equipment_seq, b.threshold_over_event_type_seq) AS row_num, ' +
                'b.equipment_seq, ' +
                'a.threshold_over_event_type_seq, ' +
                'b.threshold_over_event_sensor, ' +
                'b.threshold_over_event_values, ' +
                'a.threshold_over_event_name ' +
                'FROM threshold_over_event_type a JOIN threshold_over_event_values b ' +
                'ON a.threshold_over_event_type_seq = b.threshold_over_event_type_seq',
                (err, thresholdDataList) => {
                if (err) console.log("DataBase Query Error : ", err);
                res.json({
                    success: true,
                    thresholdDataList: thresholdDataList,
                })
            })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    //장비 주의 경고 값 가져오기(GET)
    getEquipmentThresholdValue: (req, res) => {
        try {
            connection.query('SELECT c.equipment_name equipment_name, d.* ' +
                'FROM equipment_info c JOIN ' +
                '(SELECT ' +
                'a.threshold_over_event_values_seq threshold_over_event_values_seq, ' +
                'a.equipment_seq equipment_seq, ' +
                'a.threshold_over_event_type_seq threshold_over_event_type_seq, ' +
                'a.threshold_over_event_sensor threshold_over_event_sensor, ' +
                'a.threshold_over_event_values threshold_over_event_values, ' +
                'b.threshold_over_event_name threshold_over_event_name ' +
                'FROM threshold_over_event_values a JOIN threshold_over_event_type b ' +
                'ON a.threshold_over_event_type_seq = b.threshold_over_event_type_seq) d ' +
                'ON c.equipment_seq = d.equipment_seq ' +
                'WHERE d.equipment_seq = ?',
                req.query.equipSettingNum,
                (err, thresholdValue) => {
                    if (err) console.log("DataBase Query Error : ", err);
                    res.json({
                        success: true,
                        thresholdValue: thresholdValue,
                    })
                }
            )
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    //장비 리스트 가져오기
    /*getEquipmentList: (req, res) => {
        try {
            connection.query('SELECT EQUIPMENT_SEQ, EQUIPMENT_NAME, EQUIPMENT_LAT, EQUIPMENT_LNG FROM EQUIPMENT_INFO',
                (err, data) => {
                    if (err) console.log("DataBase Query Error : ", err);
                    res.json({
                        success: true,
                        equipmentList: data
                    })
                })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },*/
    /*
        장비 리스트 가져오기 & 장비 별 최신 데이터 가져오기 LEFT INNER JOIN 속도 느려질수 있음
        별도로 getRecentDataList 만들어둠.
        만약 느려질 경우, getRecentDataList로 따로 장비별 최신 데이터 호출하여 프론트엔드 단에서 처리
        getRecentDataList에서 호출하는 쿼리가 느릴 경우, DATA_DATE_TIME DESC로 인덱스 생성하여 사용할 것.

        쿼리문에서 ES6 멀티 라인 문자열 적용
    */
    getEquipmentList: (req, res) => {
        try {
            connection.query(`SELECT
                                  A.equipment_seq,
                                  A.equipment_type_seq,
                                  A.member_seq,
                                  A.equipment_lat,
                                  A.equipment_lng,
                                  A.equipment_reg_date,
                                  A.equipment_name,
                                  A.equipment_install_place,
                                  A.equipment_install_company,
                                  A.equipment_tcp_port,
                                  B.sensor_component_seq,
                                  B.sensor_component_period_type,
                                  DATE_FORMAT(B.data_date_time, "%y-%m-%d %H:%i:%s") data_date_time,
                                  B.sensor_is_alarm,
                                  IFNULL(FLOOR(B.sensor_signal_data_tod), "NULL") TOD,
                                  IFNULL(FLOOR(B.sensor_signal_data_mos), "NULL") MOS,
                                  IFNULL(B.sensor_signal_data_voc, "NULL") VOC,
                                  IFNULL(B.sensor_signal_data_h2s, "NULL") H2S,
                                  IFNULL(B.sensor_signal_data_nh3, "NULL") NH3,
                                  IFNULL(B.sensor_signal_data_ott, "NULL") OTT,
                                  IFNULL(B.sensor_signal_data_oth, "NULL") OTH,
                                  IFNULL(B.sensor_signal_data_owd, "NULL") OWD,
                                  IFNULL(B.sensor_signal_data_ows, "NULL") OWS,
                                  IFNULL(B.sensor_signal_data_btv, "NULL") BTV,
                                  IFNULL(B.sensor_signal_data_itt, "NULL") ITT,
                                  IFNULL(B.sensor_signal_data_vsd, "NULL") VSD,
                                  IFNULL(B.sensor_signal_data_PSD, "NULL") PSD
                                    FROM equipment_info A LEFT OUTER JOIN (
                                    SELECT * FROM
                                    (SELECT  *, ROW_NUMBER() OVER (PARTITION BY EQUIPMENT_SEQ ORDER BY DATA_DATE_TIME DESC) AS RankNo
                                    FROM SENSOR_COMPONENT
                                    ) T
                                    WHERE RankNo = 1) B
                                    ON A.EQUIPMENT_SEQ = B.EQUIPMENT_SEQ`,
                (err, data) => {
                    if (err) console.log("DataBase Query Error : ", err);
                    res.json({
                        success: true,
                        equipmentList: data
                    })
                })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    //장비 명칭 바꾸기
    setChangeEquipName: (req, res) => {
        try {
            connection.query('UPDATE EQUIPMENT_INFO SET EQUIPMENT_NAME = ? WHERE EQUIPMENT_SEQ = ?',
                [req.query.equipment_data,req.query.num],
                (err, data) => {
                    if (err) console.log("DataBase Query Error : ", err);
                    res.json({
                        success: true,
                        message: '장비 이름이 수정 되었습니다.'
                    })
                })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    //장비 삭제하기
    deleteEquipment: (req, res) => {
        try {
            connection.query('DELETE FROM EQUIPMENT_INFO WHERE EQUIPMENT_SEQ = ?',
                req.query.num,
                (err, data) => {
                    if (err) console.log("DataBase Query Error : ", err);
                    res.json({
                        success: true,
                        message: '해당 장비가 삭제 되었습니다.'
                    })
                })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    //장비 악취 주의, 경고 값 설정하기
    setThresholdData: (req, res) => {
        /*
            악취 주의, 경고 값 설정 프로세스
            1. 전달된 장비 넘버를 이용해서 악취, 주의 설정 값이 있는지 확인
            2. 만약 주의 또는 경고 컬럼이 있다면 update 쿼리 진행
            3. 만약 주의 또는 경고 컬럼이 없다면 insert 쿼리 진행
        */
        try {
            if(req.query.todCaution != ''){
                connection.query('SELECT a.threshold_over_event_values_seq threshold_over_event_values_seq ' +
                    'FROM THRESHOLD_OVER_EVENT_VALUES a JOIN THRESHOLD_OVER_EVENT_TYPE b ' +
                    'ON a.threshold_over_event_type_seq = b.threshold_over_event_type_seq ' +
                    'WHERE a.equipment_seq = ? AND b.threshold_over_event_name = "악취주의"',
                    req.query.saveEquipNum,
                    (err, cautionData) => {
                        if (err) console.log("DataBase Query Error : ", err);
                        //주의 값이 있음.
                        if (cautionData.length > 0) {
                            let cautionDataSeq;
                            for (let data of cautionData){
                                cautionDataSeq = data.threshold_over_event_values_seq;
                            };
                            connection.query('UPDATE THRESHOLD_OVER_EVENT_VALUES SET THRESHOLD_OVER_EVENT_VALUES = ? WHERE THRESHOLD_OVER_EVENT_SENSOR = "TOD" AND threshold_over_event_values_seq = ?',
                                [
                                    req.query.todCaution,
                                    cautionDataSeq
                                ],
                                (err ,cautionUpdate) => {
                                    if (err) console.log("DataBase Query Error : ", err);
                                    console.log(cautionUpdate,'악취 주의 값 설정이 UPDATE 되었습니다.')
                                    /*res.json({
                                        success: true,
                                        message: '악취 주의 값 설정이 UPDATE 되었습니다.'
                                    })*/
                                })
                        } else {
                            connection.query('INSERT INTO THRESHOLD_OVER_EVENT_VALUES (EQUIPMENT_SEQ, THRESHOLD_OVER_EVENT_TYPE_SEQ, THRESHOLD_OVER_EVENT_SENSOR, THRESHOLD_OVER_EVENT_VALUES) ' +
                                'VALUES (?,?,?,?)',
                                [
                                    req.query.saveEquipNum,
                                    1,
                                    'TOD',
                                    req.query.todCaution
                                ],
                                (err ,cautionInsert) => {
                                    if (err) console.log("DataBase Query Error : ", err);
                                    console.log(cautionInsert,'악취 주의 값 설정이 INSERT 되었습니다.')
                                    /*res.json({
                                        success: true,
                                        message: '악취 주의 값 설정이 INSERT 되었습니다.'
                                    })*/
                                })
                        }
                    })
            }
            if(req.query.todWarning != ''){
                connection.query('SELECT a.threshold_over_event_values_seq threshold_over_event_values_seq ' +
                    'FROM THRESHOLD_OVER_EVENT_VALUES a JOIN THRESHOLD_OVER_EVENT_TYPE b ' +
                    'ON a.threshold_over_event_type_seq = b.threshold_over_event_type_seq ' +
                    'WHERE a.equipment_seq = ? AND b.threshold_over_event_name = "악취경고"',
                    req.query.saveEquipNum,
                    (err, warningData) => {
                        if (err) console.log("DataBase Query Error : ", err);
                        //경고 값이 있음.
                        if (warningData.length > 0) {
                            let warningDataSeq;
                            for (let data of warningData){
                                warningDataSeq = data.threshold_over_event_values_seq;
                            };
                            connection.query('UPDATE THRESHOLD_OVER_EVENT_VALUES SET THRESHOLD_OVER_EVENT_VALUES = ? WHERE THRESHOLD_OVER_EVENT_SENSOR = "TOD" AND threshold_over_event_values_seq = ?',
                                [
                                    req.query.todWarning,
                                    warningDataSeq
                                ],
                                (err ,WarningUpdate) => {
                                    if (err) console.log("DataBase Query Error : ", err);
                                    console.log(WarningUpdate,'악취 경고 값 설정이 UPDATE 되었습니다.')

                                })
                        } else {
                            connection.query('INSERT INTO THRESHOLD_OVER_EVENT_VALUES (EQUIPMENT_SEQ, THRESHOLD_OVER_EVENT_TYPE_SEQ, THRESHOLD_OVER_EVENT_SENSOR, THRESHOLD_OVER_EVENT_VALUES) ' +
                                'VALUES (?,?,?,?)',
                                [
                                    req.query.saveEquipNum,
                                    2,
                                    'TOD',
                                    req.query.todWarning
                                ],
                                (err ,WarningInsert) => {
                                    if (err) console.log("DataBase Query Error : ", err);
                                    console.log(WarningInsert,'악취 경고 값 설정이 INSERT 되었습니다.')
                                    /*res.json({
                                        success: true,
                                        message: '악취 경고 값 설정이 INSERT 되었습니다.'
                                    })*/
                                })
                        }
                    })
            }
            res.json({
                success: true,
                message: '장비의 악취 주의, 경고 값을 재설정 하였습니다.'
            })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    //메인(악취)페이지 라인 차트 센서 데이터 가져오기
    getSensorChartData: (req, res) => {
        try {
            connection.query('SELECT DATE_FORMAT(DATA_DATE_TIME, "%H:%m:%s") DataDateTime, ' +
                'IFNULL(SENSOR_SIGNAL_DATA_TOD, 0) TOD,' +
                'IFNULL(SENSOR_SIGNAL_DATA_VOC, 0) VOC,' +
                'IFNULL(SENSOR_SIGNAL_DATA_MOS, 0) MOS,' +
                'IFNULL(SENSOR_SIGNAL_DATA_H2S, 0) H2S,' +
                'IFNULL(SENSOR_SIGNAL_DATA_NH3, 0) NH3 ' +
                'FROM SENSOR_COMPONENT ' +
                'WHERE EQUIPMENT_SEQ = ? AND sensor_component_period_type = 1 AND ' +
                'DATE_FORMAT(DATA_DATE_TIME, "%Y-%m-%d") = DATE_FORMAT(CURDATE(), "%Y-%m-%d") ' +
                'ORDER BY DataDateTime DESC ' +
                'LIMIT 96',
                req.query.equipNum,
                (err, sensorChartList) => {
                    if (err) console.log("DataBase Query Error : ", err);
                    res.json({
                        success: true,
                        sensorChartList: sensorChartList,
                        message: '차트 데이터를 호출하였습니다.'
                    })
                })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    //풍향 정보 가져오기
    getWindChartData: (req, res) => {
        try {
            connection.query('SELECT DATA_DATE_TIME DataDateTime, ' +
                            'FLOOR(IFNULL(SENSOR_SIGNAL_DATA_OWD, 0)) OWD, ' +
                            'IFNULL(SENSOR_SIGNAL_DATA_OWS, 0) OWS ' +
                            'FROM sensor_component ' +
                            'WHERE EQUIPMENT_SEQ = ? AND sensor_component_period_type = 1 AND ' +
                            'DATE_FORMAT(DATA_DATE_TIME, "%Y-%m-%d") = DATE_FORMAT(CURDATE(), "%Y-%m-%d") ' +
                            'ORDER BY DATA_DATE_TIME DESC',
                req.query.equipNum,
                (err,windChartList) => {
                    if (err) console.log("DataBase Query Error : ", err);
                    res.json({
                        success: true,
                        windChartList: windChartList,
                        message: '풍향 데이터를 호출하였습니다.'
                    })
                })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    /*
        악취 페이지 커스텀 오버레이에 표시할 장비 별 최신 데이터
        장비 별 호출 데이터는 동일한 최신 시간의 데이터를 가져오는 것이 아니라, 각각의 가장 마지막에 가져온 데이터들을
        표시하도록 한다.

        1번 장비의 가장 최신 데이터 시간이 2022-06-28 16:06:52 이라면 해다 데이터를 호출
        2번 장비의 센서 데이터가 2022-05-05 16:06:50 이라면 해당 데이터를 호출

        즉 각각 장비 별로 보여지는 시간 값은 다를 수 있음.
    */
    /*getRecentDataList: (req, res) => {
        try {
            connection.query('SELECT * FROM ' +
                '(SELECT  *, ROW_NUMBER() OVER (PARTITION BY EQUIPMENT_SEQ ORDER BY DATA_DATE_TIME DESC) AS RankNo ' +
                'FROM SENSOR_COMPONENT) T ' +
                'WHERE RankNo = 1',(err, dataList) => {
                if (err) console.log("DataBase Query Error : ", err);
                res.json({
                    success: true,
                    getRecentDataList: dataList,
                    message: '장비 별 최신 데이터를 조회하였습니다.'
                })
            })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    }*/
}

module.exports = EquipmentCon;