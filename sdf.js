// var moment = require('moment');
//
// var date = '2017/4/1 8:48:36';
//
//
// var ymd = date.split(' ')[0];
// var mm = ymd.split('/')[1].length;
// var dd = ymd.split('/')[2].length;
//
// var str = '';
//
// if (mm == 1) {
//     str = 'YYYY/M/'
// } else {
//     str = 'YYYY/MM/'
// }
//
// if (dd == 1) {
//     str += 'D'
// } else {
//     str += 'DD'
// }
//
//
// var kk = moment(ymd, str).format('YYYY/MM');
// var days = moment(kk, "YYYY/MM").daysInMonth();
//
// var week = moment('2017/04/02', 'YYYY/MM/DD').days();
// var day2 = moment('2017/04/02', 'YYYY/MM/DD').add(1, 'd').format('YYYY/MM/DD');
//
// console.log(ymd)
// console.log(kk)
// console.log(days)
// console.log(week)
// console.log(day2);
//
//
// var weekArr = ['(日)','(一)','(二)','(三)','(四)','(五)','(六)'];
//
// var getMonth = function (date) {  // date格式为 '2017/4/1 8:48:36';
//     var YMD = date.split(' ')[0];
//     var mm = YMD.split('/')[1].length;
//     var dd = YMD.split('/')[2].length;
//     var str = mm === 1 ? 'YYYY/M/' : 'YYYY/MM/';
//     str += dd === 1 ? 'D' : 'DD';
//     console.log(str);
//
//     var YM =moment(YMD, str).format('YYYY/MM');
//     var count = moment(YM, "YYYY/MM").daysInMonth();
//
//     var startDay = YM+'/01',allDay =[];
//     for(var i=0;i<count;i++){
//         var day = moment(startDay, 'YYYY/MM/DD').add(i, 'd').format('YYYY/MM/DD');
//         var week = moment(day, 'YYYY/MM/DD').days();
//         allDay.push(day+' '+weekArr[week])
//     }
//     console.log(allDay)
// };
//
// getMonth('2017/4/1 8:48:36')

var _ = require('lodash');
var arr =[
    [1,2],
    [1,3],
    [2,2],
    [2,3],
    [3,1],
    [3,2]
];
_.sortBy(arr,[1])
console.log(arr)
