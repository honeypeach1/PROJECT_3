/*
static 처리 연결 통로(/static)
*/
const express = require('express');
const router = express.Router();
const StaticController = require('../controller/static/StaticController')
const authUtil = require('../middlewares/auth').checkToken;

//router.get('/getData/:start_date/:end_date/:isAlarm/:dataType/:equipNum',StaticController.getData);
router.get('/goPage',authUtil,StaticController.getPage);
router.get('/getData',authUtil,StaticController.getData);
router.post('/registequip',authUtil,StaticController.getRegister)

module.exports = router;