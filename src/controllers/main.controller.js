'use strict';

angular.module('controllers').controller('mainController', ['$scope', 'Upload', '$http', '$window',
    function ($scope, Upload, $http, $window) {

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
                   console.log(resp.data.data)
                }
            }, function (resp) {
                return $scope.$emit('notification', {
                    type: 'danger',
                    message: '网络错误，与服务器通信错误'
                });
            });
        };

        $scope.submitData = function () {
            if (!$scope.newOrder.order || !$scope.newOrder.mark || !$scope.newOrder.type || !$scope.newOrder.configName) {
                return $scope.$emit('notification', {
                    type: 'warning',
                    message: '请完整填写订单信息'
                });
            }

            //盒子检测项
            if ($scope.list.length == 0) {
                return $scope.$emit('notification', {
                    type: 'warning',
                    message: '不能没有测试项'
                });
            } else {
                $scope.newOrder.boxTest = angular.toJson($scope.list)
            }

            //烧号
            var arr = [];
            $("input[name='burn']").each(function (i, one) {
                if (one.checked) {
                    arr.push($scope.burnList[one.value])
                }
            });
            if (arr.length == 0) {
                return $scope.$emit('notification', {
                    type: 'warning',
                    message: '不能没有烧号项'
                });
            } else {
                $scope.newOrder.burn = angular.toJson(arr)
            }

            //检测mac文件
            if (!$scope.macFile) {
                return $scope.$emit('notification', {
                    type: 'warning',
                    message: '请选择mac文件'
                });
            } else {
                $scope.newOrder.file = $scope.macFile;
            }

            if (!$scope.newOrder.printer.modelPath || !$scope.newOrder.printer.num) {
                return $scope.$emit('notification', {
                    type: 'warning',
                    message: '请填写打印配置'
                });
            }

            if (!$scope.newOrder.bigBox.maxNum || !$scope.newOrder.bigBox.style || !$scope.newOrder.bigBox.firstCode || !$scope.newOrder.bigBox.lastCode) {
                return $scope.$emit('notification', {
                    type: 'warning',
                    message: '请填写入库配置'
                });
            }

            Upload.upload({
                method: 'POST',
                url: '/api/orders',
                data: $scope.newOrder
            }).then(function (response) {
                if (response.data.code == 0) {
                    $scope.newOrder = {
                        order: '',//订单号
                        mark: 1, //1乐视，2大麦，3其他
                        type: 1,//1机顶盒，2路由器，3下载宝
                        boxTest: [],
                        burn: [],
                        printer: {modelPath: 'c:\\', num: '5'},
                        configName: '',
                        bigBox: {maxNum: '', style: '', firstCode: '', lastCode: ''}
                    };
                    $scope.burnList = [];
                    $scope.macFile = null;
                    $scope.burnFile = null;
                    $scope.$emit('notification', {
                        type: 'success',
                        message: '新建订单成功,有效mac数据为：“ ' + response.data.count + ' ”条'
                    });

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

        //选择mac文件事件
        $scope.selectMacFile = function (file) {
            if (!file) return;
            $scope.macFile = file;
        };

        $scope.getBurnFile = function () {
            $http({
                url: '/api/orders/burnFileList',
                method: 'GET'
            }).then(function (result) {
                if (result.data.code == 0) {
                    $scope.burnFileArray = result.data.data;
                    console.log($scope.burnFileArray )
                } else {
                    $scope.$emit('notification', {
                        type: 'danger',
                        message: result.data.msg
                    });
                }
            }, function (err) {
                $scope.$emit('notification', {
                    type: 'danger',
                    message: '网络错误，无法获取烧号配置列表'
                });
            })
        };

        $scope.$watch('burnFile',function(newVal,oldVal){
            if(!newVal){
                $scope.burnList =[];
                return;
            }

            if(newVal.data&&newVal.configPath){
                $scope.burnList =newVal.data;
                $scope.newOrder.configName = newVal.configPath;
                return;
            }
            $http({
                method:'GET',
                url:'/api/orders/oneBurnFile',
                params:{configPath:newVal.configPath}
            }).then(function(result){
                if(result.data.code==0){
                    $scope.burnList = result.data.data;
                    $scope.newOrder.configName = newVal.configPath;
                }else{
                    $scope.$emit('notification', {
                        type: 'danger',
                        message: result.data.msg
                    });
                }
            },function(err){
                $scope.$emit('notification', {
                    type: 'danger',
                    message: '网络错误，无法获取烧号配置信息'
                });
            })
        })
    }]);
