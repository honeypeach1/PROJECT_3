/*
static 처리 연결 통로(/equipment)
*/
const express = require('express');
const router = express.Router();
const equipmentController = require('../controller/equipment/equipmentController')
const authUtil = require('../middlewares/auth').checkToken;

router.get('/getThreshold',authUtil,equipmentController.getEquipmentThreshold);
router.get('/getThresholdValue',authUtil,equipmentController.getEquipmentThresholdValue);
router.get('/getEquipmentList',authUtil,equipmentController.getEquipmentList);
router.get('/setChangeEquipName',authUtil,equipmentController.setChangeEquipName);
router.get('/deleteEquipment',authUtil,equipmentController.deleteEquipment);
router.get('/setThresholdData',authUtil,equipmentController.setThresholdData);
router.get('/getSensorChartData',authUtil,equipmentController.getSensorChartData);
router.get('/getWindChartData',authUtil,equipmentController.getWindChartData);


module.exports = router;