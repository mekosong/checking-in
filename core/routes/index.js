/**
 * Created by Administrator on 2017/5/12.
 */
const express = require('express');
const router = express.Router();

const ordersRoute = require('./orders.route');

router.use('/api/orders',ordersRoute);


module.exports = router;