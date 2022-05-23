/*웹소켓 컨트롤러 통합*/
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

const webSocketCon = {

}

module .exports = webSocketCon;