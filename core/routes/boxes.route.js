const express = require('express');
const router = express.Router();
const boxesController = require('../controllers/boxes.controller');
const userController = require('../controllers/users.controller');


/**
 * 后台接口
 */
router.route('/getBoxItems')
  .get(userController.checkFlag,boxesController.getBoxItems);

router.route('/getOneBox')
  .get(userController.checkFlag,boxesController.findOne);

router.route('/repairOneBox')
    .post(userController.checkFlag,boxesController.createOrUpdate);
router.route('/getAllBox')
    .get(boxesController.findAll);
/**
 * STB接口
 */
router.route('/testOneBox')
  .post(boxesController.createOrUpdate);

module.exports = router;
