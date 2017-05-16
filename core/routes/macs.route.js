/**
 * Created by Administrator on 2017/4/6.
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const macsController = require('../controllers/macs.controller');


router.route('*')
  .all(userController.checkFlag);

router.route('/')
  .put(macsController.updateMac);

router.route('/reset')
  .put(macsController.resetMac);

router.route('/')
  .get(macsController.getMacsList);

router.route('/getMacsTable')
  .get(macsController.getMacsTable);

router.route('/')
  .delete(macsController.deleteMac);

router.route('/resetMac')
  .post(macsController.resetMac);

module.exports = router;