/**
 * Created by Administrator on 2017/4/12.
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const bigBoxController = require('../controllers/bigBox.controller');

router.route('*')
  .all(userController.checkFlag);

//获取箱号
router.route('/bigBoxItems')
  .get(bigBoxController.bigBoxItems);


router.route('/checkMac')
  .post(bigBoxController.checkMac);

router.route('/inStorage')
  .post(bigBoxController.inStorage);

router.route('/outStorageCheck')
  .get(bigBoxController.outStorageCheck);

router.route('/outStorage')
  .post(bigBoxController.outStorage);


//获取所有箱号
router.route('/bigBoxTable')
  .get(bigBoxController.bigBoxTable);

router.route('/updateBox')
  .put(bigBoxController.updateBox);

router.route('/resetBigBox')
  .put(bigBoxController.resetBigBox);






module.exports = router;