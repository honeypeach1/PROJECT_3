/*
user 처리 연결 통로(/user)
*/
const express = require('express');
const router = express.Router();
const userController = require('../controller/user/UserController')
const authUtil = require('../middlewares/auth').checkToken;

router.post('/loginCheck',userController.loginCheck);
router.post('/logout',userController.userLogout);
router.post('/registerUser',userController.registerUser);
router.post('/setUserPass',authUtil,userController.setUserPass);
router.get('/getUserInfor',authUtil,userController.getUserInfor);

module.exports = router;