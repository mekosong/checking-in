/**
 * Created by Administrator on 2017/3/27.
 */
const async = require('async');
const _ = require('lodash');
const formidable = require('formidable');
const xlsx = require('node-xlsx');
const Path = require('path');
const fs = require('fs');
const moment = require('moment');

const toolService = require('../service/tools.service');

var keyGlobal = {name: 2, date: 3, num1: 0, num2: 1};

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
            return res.send({code: 102, msg: '请检查xlsx文件标题是否包含 机器号，考勤号码，姓名，日期时间'})
        } else {
            keyGlobal = keyObj
        }

        var oneDate = obj[0].data[1][keyObj.date];
        var dayOfMonth = toolService.dayOfMonth(oneDate);

        res.send({code: 0, data: dayOfMonth, path: filePath})
    });
};


exports.doWork = function (req, res) {
    if (!req.body.path || !req.body.upTime || !req.body.downTime) return res.send({code: 999, msg: '非法操作'});

    var body = req.body;

    var bodyData = JSON.parse(body.burn);
    var obj;
    try {
        obj = xlsx.parse(body.path); // parses a file
    } catch (err) {
        return res.send({code: 101, msg: '文件错误'})
    }

    var allData = obj[0].data;
    allData.shift();//去除首行

    allData = _.map(allData, function (one, i) {
        var _data = {};
        _data.num1 = one[keyGlobal.num1];
        _data.num2 = one[keyGlobal.num2];

        var nameAndPart = one[keyGlobal.name].split('-');
        _data.name = nameAndPart[0];
        _data.part = nameAndPart[1];

        var date = toolService.normStr(one[keyGlobal.date]);
        _data.day = moment(date, 'YYYY/MM/DD HH:mm:ss').format('YYYYMMDD');
        _data.time = moment(date, 'YYYY/MM/DD HH:mm:ss').format('HHmmss');
        return _data
    });

    allData = _.sortBy(allData, ['name', 'day', 'time']);

    var checkName = '';
    var checkDay = '';
    var oneUser = {};
    var newAllData = [];
    allData.forEach(function (one, i) {
        if (checkName != one.name) {
            if (oneUser.name) {
                newAllData.push(oneUser);
                oneUser = {};
            }
            oneUser.name = one.name;
            oneUser.part = one.part;
        }

        var _key = 'n' + one.day.substring(6, 8);
        if (checkDay != one.day) {
            var upTime = moment(body.upTime, 'HHmmss');
            var userUpTime = moment(one.time, 'HHmmss');
            var minutes = userUpTime.diff(upTime, 'm');
            if (minutes <= 0) {
                oneUser[_key] = '一次>Y';
                if(allData[i + 1] && allData[i + 1].day != one.day){
                    oneUser[_key] = 'Y,缺下班卡';
                }
            } else if(minutes>0&&minutes<540){
                oneUser[_key] = '一次>迟' + minutes;
            }else{
                if(allData[i + 1] && allData[i + 1].day == one.day){
                    return;
                }else{
                    oneUser[_key] = '缺上班卡,Y';
                }
            }
        } else {
            var downTime = moment(body.upTime, 'HHmmss');
            var userDownTime = moment(one.time, 'HHmmss');
            var minutes = downTime.diff(userDownTime, 'm');
            if (allData[i + 1] && allData[i + 1].day == checkDay) {
                return;
            } else {
                if (minutes > 0) {
                    oneUser[_key] += ',退' + minutes;
                } else {
                    oneUser[_key] += ',Y';
                }
            }
            oneUser[_key] = oneUser[_key].split('>')[1]
        }

        checkDay = one.day;//检测一天两次
        checkName = one.name;//检测一天两次
        if (i == allData.length - 1) { //最后一条数据
            newAllData.push(oneUser);
        }
    });

    newAllData.forEach(function (oneNew, k) {
        bodyData.forEach(function (oneBody, l) {
            if (!oneNew[oneBody.key]) {
                newAllData[k][oneBody.key] = '缺勤'
            }
        })
    });

    res.send({code: 0, data: newAllData})
};







