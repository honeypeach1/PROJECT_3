/*
    monitoring 처리 연결 통로(/Monitoring)
*/
const express = require('express');
const router = express.Router();
const monitoringController = require('../controller/monitoring/monitoringController')

router.get('/getMonitorData',monitoringController.getMonitorData);

module.exports = router;
