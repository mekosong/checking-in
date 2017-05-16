'use strict';

angular.module('controllers').controller('mainController', ['$scope', 'Upload', '$http', '$window',
    function ($scope, Upload, $http, $window) {

        $scope.dayList = [];
        $scope.newOrder = {};


        $scope.Arr = ["日", "一", "二", "三", "四", "五", "六"];
        $scope.dt = new Date();
        $scope.weekIndex = $scope.dt.getDay();
        $scope.week = "星期" + $scope.Arr[$scope.weekIndex];


        $scope.selectChange = function (obj) {
            var index = document.getElementById('pro_select').selectedIndex;
            if (index >= 1) {
                $scope.list.push(obj);
                $scope.restList.splice(index - 1, 1);
            }
        };

        $scope.uploadFiles = function (file) {
            if (!file[0]) return;
            Upload.upload({
                url: '/api/orders/uploadFile',
                method: 'POST',
                data: {file: file}
            }).then(function (resp) {
                if (resp.data.code != 0) {
                    $scope.$emit('notification', {
                        type: 'danger',
                        message: resp.data.msg
                    });
                } else {
                    $scope.dayList = resp.data.data;
                    $scope.newOrder.path = resp.data.path;
                }
            }, function (resp) {
                return $scope.$emit('notification', {
                    type: 'danger',
                    message: '网络错误，与服务器通信错误'
                });
            });
        };

        $scope.doSubmit = function () {
            // var upTime = moment($scope.newOrder.upTime, 'HHmmss').format('HH:mm:ss');
            // var downTime = moment($scope.newOrder.downTime, 'HHmmss').format('HH:mm:ss');
            // if (!upTime || !downTime) {
            //     return $scope.$emit('notification', {
            //         type: 'warning',
            //         message: '不能没有上下时间'
            //     });
            // }
            // //日期选择
            // var arr = [];
            // $("input[name='burn']").each(function (i, one) {
            //     if (one.checked) {
            //         arr.push($scope.dayList[one.value])
            //     }
            // });
            // if (arr.length == 0) {
            //     return $scope.$emit('notification', {
            //         type: 'warning',
            //         message: '不能没有工作日'
            //     });
            // } else {
            //     $scope.newOrder.burn = angular.toJson(arr)
            // }
            //
            // console.log($scope.newOrder)
            $http({
                method: 'POST',
                url: '/api/orders/doWork',
                data: $scope.newOrder
            }).then(function (response) {
                if (response.data.code == 0) {
                    $scope.$emit('notification', {
                        type: 'success',
                        message: '成功'
                    });

                    $scope.renderTable(response.data);
                } else {
                    $scope.$emit('notification', {
                        type: 'danger',
                        message: response.data.msg
                    });
                }
            }, function (err) {
                $scope.$emit('notification', {
                    type: 'danger',
                    message: '网络错误，提交失败'
                });
            });

        };


        $scope.renderTable = function (data) {
            $('#table1').bootstrapTable({
                pagination: true,
                pageSize: 10, //每页显示10条
                cache: false,
                search: true,
                showColumns: 'true',
                showExport: true,//显示导出按钮
                exportDataType: "all",//导出类型
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return index
                        }

                    }, {
                        title: '姓名',
                        field: 'name'
                    }, {
                        title: '部门',
                        field: 'department'
                    }, {
                        title: '维修人员',
                        field: 'user'
                    }, {
                        title: '时间',
                        field: 'time',
                        sortable: true
                    }, {
                        title: '状态',
                        field: 'isRepair',
                        sortable: true,
                        formatter: function (value, row, index) {
                            if (value == 1) {
                                return "已维修";
                            }
                            return '<span class="text-danger">' + "未维修" + '</span>';
                        }
                    }
                ],
                data: res.data

            })

        }
    }]);
