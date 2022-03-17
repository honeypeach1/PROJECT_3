/*TCP/IP 소켓 Receive Data 처리(Insert) 부분*/
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../config/database");
const {response} = require("express");
const dbConnect = mariaDB.createConnection(db.mariaConfig);

exports.socketInsert = (socketJson) => {
    /*
    * 2022-03-17 기준
    * 제품 타입 구분이 필요함.
    * 제품 타입 번호가 1번이면 측정이냐, 2번이면 채취냐, 3번이면 분석이냐?
    * 해당 제품 타입 구분에 따라 insert DB가 달라짐.
    * 1번과 2번이면 to Sensor Component table
    * 3번이면 GC Component와 IC Component
    *
    * 초기 테스트 버전으로 따로 장비 구분없이 AMS 제품군으로만 INSERT DB 처리
    * */
    dbConnect.query('INSERT INTO sensor_component set ?',
        socketJson,
        function (err,res) {
            if (err) throw err;
        })
}