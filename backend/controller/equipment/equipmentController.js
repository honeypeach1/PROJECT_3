//서버 실행시 받아오는 정보
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../../config/database");
const dbConnect = mariaDB.createConnection(db.mariaConfig);

//그룹화 설정 전연 함수
const groupBy = function (data, key) {
    return data.reduce(function (carry, el) {
        var group = el[key];
        if (carry[group] === undefined) {
            carry[group] = []
        }
        carry[group].push(el)
        return carry
    }, {})
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
            dbConnect.query('SELECT a.EQUIPMENT_SEQ EQUIPMENT_SEQ, a.EQUIPMENT_NAME EQUIPMENT_NAME, b.EQUIPMENT_TYPE_SEQ EQUIPMENT_TYPE_SEQ ,b.EQUIPMENT_TYPE_NAME EQUIPMENT_TYPE_NAME ' +
                'FROM equipment_info a JOIN equipment_type b ON a.equipment_type_seq = b.equipment_type_seq',
                (err, equpiment) => {
                    if (err) throw err;
                    // const result = Object.values(JSON.parse(JSON.stringify(equpiment)));
                    for (let list of equpiment) {
                        equipList = {
                            num: list.EQUIPMENT_TYPE_NAME,
                            text: list.EQUIPMENT_NAME,
                            value: list.EQUIPMENT_SEQ
                        }
                        lastList.push(equipList);
                    }

                    res.json({
                        success: true,
                        equipmentList: groupBy(lastList, 'num'),
                    })
                }
            )
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    },
    //장비 주의 경고 값 가져오기(GET)
    getEquipmentThresholdValue: (req, res) => {
        try {
            dbConnect.query('SELECT c.equipment_name equipment_name, d.* ' +
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
                    if (err) throw err;
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
    getEquipmentList: (req, res) => {
        try {
            dbConnect.query('SELECT EQUIPMENT_SEQ, EQUIPMENT_NAME, EQUIPMENT_LAT, EQUIPMENT_LNG FROM EQUIPMENT_INFO',
                (err, data) => {
                    if (err) throw err;
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
            dbConnect.query('UPDATE EQUIPMENT_INFO SET EQUIPMENT_NAME = ? WHERE EQUIPMENT_SEQ = ?',
                [req.query.equipment_data,req.query.num],
                (err, data) => {
                    if (err) throw err;
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
            dbConnect.query('DELETE FROM EQUIPMENT_INFO WHERE EQUIPMENT_SEQ = ?',
                req.query.num,
                (err, data) => {
                    if (err) throw err;
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
                dbConnect.query('SELECT a.threshold_over_event_values_seq threshold_over_event_values_seq ' +
                    'FROM THRESHOLD_OVER_EVENT_VALUES a JOIN THRESHOLD_OVER_EVENT_TYPE b ' +
                    'ON a.threshold_over_event_type_seq = b.threshold_over_event_type_seq ' +
                    'WHERE a.equipment_seq = ? AND b.threshold_over_event_name = "악취주의"',
                    req.query.saveEquipNum,
                    (err, cautionData) => {
                        if (err) throw err;
                        //주의 값이 있음.
                        if (cautionData.length > 0) {
                            let cautionDataSeq;
                            for (let data of cautionData){
                                cautionDataSeq = data.threshold_over_event_values_seq;
                            };
                            dbConnect.query('UPDATE THRESHOLD_OVER_EVENT_VALUES SET THRESHOLD_OVER_EVENT_VALUES = ? WHERE THRESHOLD_OVER_EVENT_SENSOR = "TOD" AND threshold_over_event_values_seq = ?',
                                [
                                    req.query.todCaution,
                                    cautionDataSeq
                                ],
                                (err ,cautionUpdate) => {
                                    if (err) throw err;
                                    console.log(cautionUpdate,'악취 주의 값 설정이 UPDATE 되었습니다.')
                                    /*res.json({
                                        success: true,
                                        message: '악취 주의 값 설정이 UPDATE 되었습니다.'
                                    })*/
                                })
                        } else {
                            dbConnect.query('INSERT INTO THRESHOLD_OVER_EVENT_VALUES (EQUIPMENT_SEQ, THRESHOLD_OVER_EVENT_TYPE_SEQ, THRESHOLD_OVER_EVENT_SENSOR, THRESHOLD_OVER_EVENT_VALUES) ' +
                                'VALUES (?,?,?,?)',
                                [
                                    req.query.saveEquipNum,
                                    1,
                                    'TOD',
                                    req.query.todCaution
                                ],
                                (err ,cautionInsert) => {
                                    if (err) throw err;
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
                dbConnect.query('SELECT a.threshold_over_event_values_seq threshold_over_event_values_seq ' +
                    'FROM THRESHOLD_OVER_EVENT_VALUES a JOIN THRESHOLD_OVER_EVENT_TYPE b ' +
                    'ON a.threshold_over_event_type_seq = b.threshold_over_event_type_seq ' +
                    'WHERE a.equipment_seq = ? AND b.threshold_over_event_name = "악취경고"',
                    req.query.saveEquipNum,
                    (err, warningData) => {
                        if (err) throw err;
                        //경고 값이 있음.
                        if (warningData.length > 0) {
                            let warningDataSeq;
                            for (let data of warningData){
                                warningDataSeq = data.threshold_over_event_values_seq;
                            };
                            dbConnect.query('UPDATE THRESHOLD_OVER_EVENT_VALUES SET THRESHOLD_OVER_EVENT_VALUES = ? WHERE THRESHOLD_OVER_EVENT_SENSOR = "TOD" AND threshold_over_event_values_seq = ?',
                                [
                                    req.query.todWarning,
                                    warningDataSeq
                                ],
                                (err ,WarningUpdate) => {
                                    if (err) throw err;
                                    console.log(WarningUpdate,'악취 경고 값 설정이 UPDATE 되었습니다.')

                                })
                        } else {
                            dbConnect.query('INSERT INTO THRESHOLD_OVER_EVENT_VALUES (EQUIPMENT_SEQ, THRESHOLD_OVER_EVENT_TYPE_SEQ, THRESHOLD_OVER_EVENT_SENSOR, THRESHOLD_OVER_EVENT_VALUES) ' +
                                'VALUES (?,?,?,?)',
                                [
                                    req.query.saveEquipNum,
                                    2,
                                    'TOD',
                                    req.query.todWarning
                                ],
                                (err ,WarningInsert) => {
                                    if (err) throw err;
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
            dbConnect.query('SELECT DATE_FORMAT(DATA_DATE_TIME, "%H:%m:%s") DATA_DATE_TIME, ' +
                'IFNULL(SENSOR_SIGNAL_DATA_TOD, 0) TOD,' +
                'IFNULL(SENSOR_SIGNAL_DATA_VOC, 0) VOC,' +
                'IFNULL(SENSOR_SIGNAL_DATA_MOS, 0) MOS,' +
                'IFNULL(SENSOR_SIGNAL_DATA_H2S, 0) H2S,' +
                'IFNULL(SENSOR_SIGNAL_DATA_NH3, 0) NH3 ' +
                'FROM SENSOR_COMPONENT ' +
                'WHERE EQUIPMENT_SEQ = ? AND sensor_component_period_type = 1 AND ' +
                'DATE_FORMAT(DATA_DATE_TIME, "%Y-%m-%d") = DATE_FORMAT(CURDATE(), "%Y-%m-%d") ' +
                'ORDER BY DATA_DATE_TIME DESC ' +
                'LIMIT 96',
                req.query.equipNum,
                (err, sensorChartList) => {
                if(err) throw err;
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
            dbConnect.query('SELECT DATA_DATE_TIME, ' +
                            'FLOOR(IFNULL(SENSOR_SIGNAL_DATA_OWD, 0)) OWD, ' +
                            'IFNULL(SENSOR_SIGNAL_DATA_OWS, 0) OWS ' +
                            'FROM sensor_component ' +
                            'WHERE EQUIPMENT_SEQ = ? AND sensor_component_period_type = 1 AND ' +
                            'DATE_FORMAT(DATA_DATE_TIME, "%Y-%m-%d") = DATE_FORMAT(CURDATE(), "%Y-%m-%d") ' +
                            'ORDER BY DATA_DATE_TIME DESC',
                req.query.equipNum,
                (err,windChartList) => {
                    if(err) throw err;
                    res.json({
                        success: true,
                        windChartList: windChartList,
                        message: '풍향 데이터를 호출하였습니다.'
                    })
                })
        } catch (err) {
            console.log("DB Connection Error!", err)
        }
    }
}

module.exports = EquipmentCon;