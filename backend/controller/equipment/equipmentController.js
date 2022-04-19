//서버 실행시 받아오는 정보
/*DB 연동*/
const mariaDB = require('maria');
const db = require("../../config/database");
const dbConnect = mariaDB.createConnection(db.mariaConfig);

const EquipmentCon = {
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
                let equipmentList = [];
                dbConnect.query('SELECT EQUIPMENT_SEQ, EQUIPMENT_NAME FROM EQUIPMENT_INFO',
                    (err, equpiment) => {
                        if (err) throw err;
                        res.json({
                            success: true,
                            equipmentList: equpiment,
                        })
                    }
                )
            } catch (err) {
                console.log("DB Connection Error!", reject(err))
            }
        }
}

module.exports = EquipmentCon;