const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');

// 登录
router.route('/loginIn')
  .post(userController.loginIn);

//登出
router.route('/loginOut')
  .post(userController.loginOut);

 //查找用户
router.route('/')
  .get(userController.checkUser,userController.findUser);

//注册
router.route('/')
  .post(userController.checkUser,userController.signIn);

//修改密码
router.route('/')
  .put(userController.checkUser,userController.changePwd);

//删除用户
router.route('/')
  .delete(userController.checkUser,userController.deleteUser);


module.exports = router;
