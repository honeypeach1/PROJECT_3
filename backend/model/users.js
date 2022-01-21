//user controller 연결 통로

const express = require('express');
const router = express.Router();
const loginController =  require('../controller/user/LoginController');
const logoutController = require('../controller/user/LogoutController');

// router.get('',loginController.showall);

module.exports = router();