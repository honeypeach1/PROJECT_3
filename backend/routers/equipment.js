/*
static 처리 연결 통로(/equipment)
*/
const express = require('express');
const router = express.Router();
const equipmentController = require('../controller/equipment/equipmentController')
const authUtil = require('../middlewares/auth').checkToken;

router.get('/getThreshold',equipmentController.getEquipmentThreshold);
router.get('/getThresholdValue',equipmentController.getEquipmentThresholdValue);
router.get('/getEquipmentList',equipmentController.getEquipmentList);
module.exports = router;