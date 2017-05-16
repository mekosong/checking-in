/**
 * Created by Administrator on 2017/3/27.
 */
const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/orders.controller');

router.route('/uploadFile')
    .post(ordersController.uploadFile);

router.route('/doWork')
    .post(ordersController.doWork);

module.exports = router;
