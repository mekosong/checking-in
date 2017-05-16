/**
 * Created by Administrator on 2017/4/5.
 */
/**
 * Created by Administrator on 2017/3/27.
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const burnController = require('../controllers/burn.controller');

router.route('*')
  .all(userController.checkFlag);

//获取烧号项
router.route('/burnItems')
  .get(burnController.burnItems);

//检验烧号项并返回烧号命令
router.route('/burnCmd')
  .post(burnController.burnCmd);


router.route('/printCheck')
  .post(burnController.printCheck)


module.exports = router;
