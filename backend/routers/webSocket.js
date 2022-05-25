/*
웹소켓 처리 연결 통로(/socket)
*/
const express = require('express');
const router = express.Router();
const webSocketController = require('../controller/websocket/websocketController')
const authUtil = require('../middlewares/auth').checkToken;

/*const schedule = require('node-schedule');

schedule.scheduledJobs('30 * * * *', function () {
    router.get('/websockets',webSocketController.scheduleData);
}, {
    scheduled: true,
    timeZone: "Asia/Seoul"
});*/
module.exports = router;
