/*
auth.Controller 연결 통로(/auth)
*/
const express = require('express');
const router = express.Router();
const authController = require('../controller/auth/auth.controller');
const authUtil = require('../middlewares/auth').checkToken;
// router.get('/authckeck',authController);

module.exports = router;