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

const initCon = {
    getEquipment: async () =>
        new Promise((resolve,reject) => {
        let dataList = [];
        try {
            connection.query('SELECT * FROM EQUIPMENT_INFO',
                (err, val) => {
                    if (err) console.log("DataBase Query Error : ", err);
                    if (val.length > 0) {
                        for (let data of val) {
                            dataList.push(data.equipment_tcp_port)
                            return resolve(dataList);
                        }
                    }
                }
            )
        } catch (err) {
            console.log("DB Connection Error!", reject(err))
        }
    })
}

module.exports = initCon;