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
            let equipList = new Object();
            let lastList = new Array();
            let data = [];
            dbConnect.query('SELECT a.EQUIPMENT_SEQ EQUIPMENT_SEQ, a.EQUIPMENT_NAME EQUIPMENT_NAME, b.EQUIPMENT_TYPE_SEQ EQUIPMENT_TYPE_SEQ ,b.EQUIPMENT_TYPE_NAME EQUIPMENT_TYPE_NAME ' +
                'FROM equipment_info a JOIN equipment_type b ON a.equipment_type_seq = b.equipment_type_seq',
                (err, equpiment) => {
                    if (err) throw err;
                    // const result = Object.values(JSON.parse(JSON.stringify(equpiment)));
                    for (let list of equpiment) {
                        equipList = {num: list.EQUIPMENT_TYPE_NAME, text: list.EQUIPMENT_NAME, value: list.EQUIPMENT_SEQ}
                        lastList.push(equipList);
                    }
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
                    res.json({
                        success: true,
                        equipmentList: groupBy(lastList, 'num'),
                    })
                }
            )
        } catch (err) {
            console.log("DB Connection Error!", reject(err))
        }
    }
}

module.exports = EquipmentCon;