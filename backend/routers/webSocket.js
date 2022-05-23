/*
웹소켓 처리 연결 통로(/socket)
*/
const express = require('express');
const router = express.Router();
const webSocketController = require('../controller/websocket/websocketController')
const authUtil = require('../middlewares/auth').checkToken;

/*router.post('/websocket',webSocketController.callSocket);*/

module.exports = router;