/*
user 처리 연결 통로(/router)
*/
const express = require('express');
const router = express.Router();
const userController = require('../controller/user/UserController')
const authUtil = require('../middlewares/auth').checkToken;

router.post('/loginCheck',userController.loginCheck);
router.post('/logout',userController.userLogout);
router.post('/registerUser',userController.registerUser);

module.exports = router;