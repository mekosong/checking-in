/**
 * Created by Administrator on 2017/5/16.
 */
const moment = require('moment');

var weekArr = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];

exports.dayOfMonth = function (date) {  // date格式为 '2017/4/1 8:48:36';
    date = exports.normStr(date);

    var YM = moment(date, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM');
    var count = moment(YM, "YYYY/MM").daysInMonth();

    var startDay = YM + '/01', allDay = [];
    for (var i = 0; i < count; i++) {
        var day = moment(startDay, 'YYYY/MM/DD').add(i, 'd').format('YYYY/MM/DD');
        var week = moment(day, 'YYYY/MM/DD').days();
        allDay.push({day: day, week: weekArr[week],key:'n'+day.substring(8,10)})
    }
    return allDay;
};

exports.normStr = function (date) {
    var dateArr = date.split(' ');

    console.log(dateArr)
    var _ymd = dateArr[0].split('/');
    var MM = _ymd[1].length;
    var DD = _ymd[2].length;
    if(MM&&DD){
        var ymdStr = MM === 1 ? 'YYYY/M/' : 'YYYY/MM/';
        ymdStr += DD === 1 ? 'D' : 'DD';
    }

    var _hms = dateArr[1].split(':');
    var HH = _hms[0].length;
    var mm = _hms[1].length;
    var ss = _hms[2].length;
    if(HH&&mm&&ss){
        var hmsStr = HH === 1 ? 'H:' : 'HH:';
        hmsStr += mm === 1 ? 'm:' : 'mm:';
        hmsStr += ss === 1 ? 's' : 'ss';
    }

    var allStr = ymdStr+' '+hmsStr;

    return moment(date,allStr).format('YYYY/MM/DD HH:mm:ss')

}