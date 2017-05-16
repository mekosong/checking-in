/**
 * Created by Administrator on 2017/3/27.
 */
const async = require('async');
const _ = require('lodash');
const formidable = require('formidable');
const xlsx = require('node-xlsx');
const Path = require('path');
const fs = require('fs');

const toolService = require('../service/tools.service');

//上传烧号配置
exports.uploadFile = function (req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'public/upload/';
    form.keepExtensions = true;
    form.maxFieldsSize = 50 * 1024 * 1024; // 50MB
    form.hash = 'md5';
    form.multiples = false;
    form.parse(req, function (err, fields, fileObj) {

        var oneFile = fileObj['file[0]'];
        if (!oneFile)return res.send({code: 101, msg: '文件错误'});

        var obj;

        var filePath = Path.join(__dirname, '../../', oneFile.path);

        try {
            obj = xlsx.parse(filePath); // parses a file
        } catch (err) {
            return res.send({code: 101, msg: '文件错误'})
        }


        //检查是否包含所需的列
        var keyObj = {
            name: -1,
            date: -1,
            num1: -1,
            num2: -1
        };
        var firstRow = obj[0].data[0];
        console.log(firstRow)
        for (var i = 0; i < firstRow.length; i++) {
            switch (firstRow[i]) {
                case '机器号':
                    keyObj.num1 = i;
                    break;
                case '考勤号码':
                    keyObj.num2 = i;
                    break;
                case '姓名':
                    keyObj.name = i;
                    break;
                case '日期时间':
                    keyObj.date = i;
                    break;
            }
        }

        var checkXlsxError = false;
        for (var oneBurnKey in keyObj) {
            if (keyObj[oneBurnKey] == -1) {
                checkXlsxError = true;
                break;
            }
        }
        if (checkXlsxError) {
            return res.send({code:102,msg:'请检查xlsx文件标题是否包含 机器号，考勤号码，姓名，日期时间'})
        }

        var oneDate = obj[0].data[1][keyObj.date];
        var YMD = oneDate.split(' ')[0];

        var dayOfMonth = toolService.dayOfMonth(YMD);

        res.send({code: 0,data:dayOfMonth})


    });
};


//新建订单，并存储xlsx的数据
exports.uploadFile2 = function (req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'file_upload/mac/';
    form.keepExtensions = true;
    form.maxFieldsSize = 50 * 1024 * 1024; // 50MB
    form.hash = 'md5';
    form.multiples = false;
    form.parse(req, function (err, fields, fileObj) {
        var body = fields;

        if (!body.order || !Number(body.mark) || !Number(body.type) || !body.configName) {
            return res.send(ERROR_LIST.lackParam)
        }
        var option = {
            order: body.order,
            mark: Number(body.mark),
            type: Number(body.type),
            configName: body.configName,
            printer: {},
            bigBox: {},
            createUser: req.user
        };


        var boxTest = [], boxTestJson = {name: {}, key: {}}, boxTestError;
        var burn = [], burnJson = {name: {}, key: {}}, burnError;
        var obj, count = 0, checkXlsx = {};

        //检查烧号配置
        if (typeof body.burn == 'string') {
            try {
                body.burn = JSON.parse(body.burn)
            } catch (err) {
                return res.send(ERROR_LIST.lackBurnParam)
            }
        }
        if (!_.isArray(body.burn) || body.burn.length == 0) { //是否为数组，并长度不为0
            return res.send(ERROR_LIST.lackBurnParam)
        }

        body.burn.forEach(function (one) {
            if (one.name && one.key) {
                if (!burnJson.name[one.name] && !burnJson.key[one.key]) { //去重复
                    burn.push(one);
                    burnJson.name[one.name] = 1;
                    burnJson.key[one.key] = 1;

                    checkXlsx[one.key] = 1;  //用于对xlsx文件的检测
                } else {
                    burnError = true;
                }
            } else {
                burnError = true;
            }
        });

        if (burnError) {
            return res.send(ERROR_LIST.lackBurnParam2)
        } else {
            option.burn = burn
        }


        //检测mac文件与烧号项是否匹配
        var oneFile = fileObj['file'];
        if (!oneFile) return res.send(ERROR_LIST.fileError);

        var filePath = Path.join(__dirname, '../../', oneFile.path);

        try {
            obj = xlsx.parse(filePath); // parses a file
        } catch (err) {
            return res.send(ERROR_LIST.fileError)
        }

        var keyObj = {
            mac: -1,
            sn: -1,
            sw: -1,
            hw: -1,
            key1: -1,
            key2: -1,
            key3: -1,
            key4: -1
        };
        var firstRow = obj[0].data[0];
        for (var i = 0; i < firstRow.length; i++) {
            switch (firstRow[i]) {
                case 'mac':
                    keyObj.mac = i;
                    break;
                case 'sn':
                    keyObj.sn = i;
                    break;
                case 'sw':
                    keyObj.sw = i;
                    break;
                case 'hw':
                    keyObj.hw = i;
                    break;
                case 'key1':
                    keyObj.key1 = i;
                    break;
                case 'key2':
                    keyObj.key2 = i;
                    break;
                case 'key3':
                    keyObj.key3 = i;
                    break;
                case 'key4':
                    keyObj.key4 = i;
                    break;
            }
        }

        //文件缺失勾选的烧号项直接给前端返回错误
        var checkXlsxError = false;
        for (var oneBurnKey in checkXlsx) {
            if (keyObj[oneBurnKey] == -1) {
                checkXlsxError = true;
                break;
            }
        }
        if (checkXlsxError) {
            return res.send(ERROR_LIST.macFileError)
        }

        //检测打印配置
        if (!body["printer[modelPath]"] || !Number(body["printer[num]"])) {
            return res.send(ERROR_LIST.lackPrinterParam)
        } else {
            option.printer.modelPath = body["printer[modelPath]"];
            option.printer.num = Number(body["printer[num]"]);
        }

        //检测入库配置
        if (!Number(body["bigBox[maxNum]"]) || !Number(body["bigBox[style]"]) || !body["bigBox[firstCode]"] || !body["bigBox[lastCode]"]) {
            return res.send(ERROR_LIST.lackBigBoxParam)
        } else {
            option.bigBox.maxNum = Number(body["bigBox[maxNum]"]);
            option.bigBox.style = Number(body["bigBox[style]"]);
            option.bigBox.firstCode = body["bigBox[firstCode]"];
            option.bigBox.lastCode = body["bigBox[lastCode]"];
        }


        //检查板卡测试配置
        if (typeof body.boxTest == 'string') { //当为json时转为array
            try {
                body.boxTest = JSON.parse(body.boxTest)
            } catch (err) {
                return res.send(ERROR_LIST.lackTestParam)
            }
        }

        if (!_.isArray(body.boxTest) || body.boxTest.length == 0) { //是否为数组，并长度不为0
            return res.send(ERROR_LIST.lackTestParam)
        }
        body.boxTest.forEach(function (one) {
            if (one.name && one.key) { //去空值
                if (!boxTestJson.name[one.name] && !boxTestJson.key[one.key]) { //去重复
                    boxTest.push(one);
                    boxTestJson.name[one.name] = 1;
                    boxTestJson.key[one.key] = 1
                } else {
                    boxTestError = true;
                }
            } else {
                boxTestError = true;
            }
        });

        if (boxTestError) {
            return res.send(ERROR_LIST.lackTestParam2)
        } else {
            option.boxTest = boxTest
        }


        async.waterfall([
            function (callback) { //检查订单号是否唯一
                ordersService.findOne({order: option.order}, function (err, order) {
                    callback(err, order);
                })
            },
            function (order, callback) {  //从tools中计算新订单的唯一值
                if (order) return callback(ERROR_LIST.orderExist);

                toolsService.getCount({name: 'orders'}, function (err, ordersData) {
                    callback(err, ordersData)
                })
            },
            function (ordersData, callback) { //存储到orders订单集合
                option.flag = ordersData.count;

                ordersService.save(option, function (err, data) {
                    callback(err, data)
                })
            },
            function (newOrder, callback) { //将上传的mac文件写入数据库
                obj[0].data.shift(); //删除xlsx文件的第一行（字段名称行）
                async.forEach(obj[0].data, function (oneData, cb) {

                    //检测xlsx文件是否有行缺失关键字段
                    var oneCheck = false;
                    for (var k in checkXlsx) {
                        if (!oneData[keyObj[k]]) {
                            oneCheck = true;
                            break;
                        }
                    }

                    if (oneCheck) { //缺失关键字段，跳过
                        cb();
                    } else { //数据齐全进入mac表
                        count++; //记录有效数据
                        var query = {
                            mac: oneData[keyObj.mac] || '',
                            sn: oneData[keyObj.sn] || '',
                            state: 0,
                            burnNum: {workNum: '', time: '', mistake: 0, mark: ''},
                            checkNum: {workNum: '', time: '', mistake: 0, mark: ''},
                            printNum: {workNum: '', time: '', mistake: 0, mark: ''},
                            wMac: '',
                            bigBox: '',
                            sw: oneData[keyObj.sw] || '',
                            hw: oneData[keyObj.hw] || '',
                            key1: oneData[keyObj.key1] || '',
                            key2: oneData[keyObj.key2] || '',
                            key3: oneData[keyObj.key3] || '',
                            key4: oneData[keyObj.key4] || ''
                        };

                        macsService.save({data: query, flag: newOrder.flag}, function (err, data) { //保存当行的值进入macs表
                            if (err) {
                                if (err.code == 11000) { //mac插入失败，有关键字段重复了，移至 logs报错表
                                    var logQuery = {
                                        mac: oneData[keyObj.mac],
                                        sn: oneData[keyObj.sn],
                                        msg: '关键字段重复' + err.message.split('key').pop()
                                    };
                                    logsService.save({data: logQuery, flag: newOrder.flag}, function (err, data) {
                                        cb(err)
                                    })
                                } else {
                                    cb(err)
                                }
                            } else {
                                cb()
                            }
                        })
                    }
                }, function (err, data) {
                    if (err) {
                        console.error(err);
                        return callback(ERROR_LIST.databaseError);
                    }

                    callback(null, newOrder)
                });
            },
            function (newOrder, callback) {
                var count2 = Math.ceil(count / newOrder.bigBox.maxNum);
                ordersService.update({flag: newOrder.flag, count: count2}, function (err) {
                    callback(err)
                })
            }
        ], function (err, result) {
            if (err) return res.send(err);

            res.send({code: 0, count: count})
        });

    });


};






