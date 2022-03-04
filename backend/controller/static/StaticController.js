/*통계 자료 컨트롤러 통합*/
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../../config/database");
const dbConnect = mariaDB.createConnection(db.mariaConfig);

const staticCon = {
    getData: (req, res) => {
        console.log("req: ",req.query)
    }
}

module.exports = staticCon;