/**
 * Created by Administrator on 2017/5/16.
 */
const moment = require('moment');

var weekArr = ['(日)','(一)','(二)','(三)','(四)','(五)','(六)'];

exports.dayOfMonth = function (date) {  // date格式为 '2017/4/1 8:48:36';
    var YMD = date.split(' ')[0];
    var mm = YMD.split('/')[1].length;
    var dd = YMD.split('/')[2].length;
    var str = mm === 1 ? 'YYYY/M/' : 'YYYY/MM/';
    str += dd === 1 ? 'D' : 'DD';
    console.log(str);

    var YM =moment(YMD, str).format('YYYY/MM');
    var count = moment(YM, "YYYY/MM").daysInMonth();

    var startDay = YM+'/01',allDay =[];
    for(var i=0;i<count;i++){
        var day = moment(startDay, 'YYYY/MM/DD').add(i, 'd').format('YYYY/MM/DD');
        var week = moment(day, 'YYYY/MM/DD').days();
        allDay.push({day:day,week:weekArr[week]})
    }
    return allDay;
};