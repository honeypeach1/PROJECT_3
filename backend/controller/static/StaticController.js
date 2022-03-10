/*통계 자료 컨트롤러 통합*/
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../../config/database");
const dbConnect = mariaDB.createConnection(db.mariaConfig);

const staticCon = {
    getData: (req, res) => {

        res.json({
            success: true,
            message: '일치하는 알람 데이터 조회에 성공하였습니다.'
        })
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

    }
}

module.exports = staticCon;