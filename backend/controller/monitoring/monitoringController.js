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

const monitoringCon = {
    getMonitorData: (req, res) => {
        let user_info = req.session.user_cookie;
        /*세션을 확인함. 세션이 끊기면 로그인 페이지로*/
        if (user_info != null) {
            res.json({
                success: true,
                user_info: user_info[1],
                message: '악취 탭으로 페이지 이동 합니다.'
            })
        } else {
            res.json({
                success: false,
                message: '세션이 만료되었습니다.'
            })
        }
    }
}

module.exports = monitoringCon;