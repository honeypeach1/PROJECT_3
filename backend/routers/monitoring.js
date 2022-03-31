/*
    monitoring 처리 연결 통로(/Monitoring)
*/
const express = require('express');
const router = express.Router();
const monitoringController = require('../controller/monitoring/monitoringController')
const authUtil = require('../middlewares/auth').checkToken;

router.get('/getMonitorData',authUtil,monitoringController.getMonitorData);

module.exports = router;
