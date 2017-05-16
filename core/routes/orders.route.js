/**
 * Created by Administrator on 2017/3/27.
 */
const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/orders.controller');

//查找订单
router.route('/')
  .get(function(req,res,next){
    console.log(444)
    res.send({code:0})
  });

router.route('/uploadFile')
    .post(ordersController.uploadFile);

// router.route('/')
//   .get(ordersController.findOrder);
//
// //新增订单
// router.route('/')
//   .post(userController.checkUser,ordersController.newOrder);
//
// //删除订单
// router.route('/')
//   .delete(userController.checkUser,ordersController.deleteOrder);
//
//上传订单烧号配置文件

//
// //获取烧号配置文件列表
// router.route('/burnFileList')
//   .get(ordersController.burnFileList);
//
// //获取烧号配置文件信息
// router.route('/oneBurnFile')
//   .get(ordersController.oneBurnFile);


module.exports = router;
