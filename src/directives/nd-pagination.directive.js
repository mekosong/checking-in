
angular.module('directives').directive('orderModel', [ '$window','QueryOrder','$state',
    function ($window,QueryOrder,$state) {
        return {
            replace: true,
            restrict: "E",
            template: '<div class="modal fade" id="orderModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> ' +
            '<div class="modal-dialog">' +
            '<div class="modal-content panel-blue" >' +
            '<div class="modal-header">' +
            '<div ng-if="!hideTitle" class="pull-right"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div>' +
            '<h4  class="modal-title" id="myModalLabel" style="color: #fff;margin-bottom: 11px;"><span ng-if="!hideTitle">请选择订单号</span></h4>' +
            '<select  ng-model="myOrderVal" class="form-control"  ng-change="selectAction()">' +
            '<option value="1">乐视</option><option value="2">大麦</option><option value="3">其他</option>' +
            '</select>' +
            '</div>' +
            '<div class="modal-body panel-body">' +
            '<ul class="todo-list"><li class="todo-list-item" ng-repeat="myOrders in orderArr"  ng-click="chooseOrder($index)">{{myOrders.order}}' +
            '<div class="pull-right action-buttons"><span class="glyphicon glyphicon-check"></span></div>' +
            '</li></ul>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<nav aria-label="pages"><ul class="pager">' +
            '<li class="previous"><a href="#" ng-click="pageAction(-1)"><span aria-hidden="true">&larr;</span> {{prevText}}</a></li>' +
            '<li ng-if="totalPage!=0"><div class="currentPage">{{currentPage}}/{{totalPage}}</div></li>' +
            '<li class="next" ><a href="#" ng-click="pageAction(1)">{{nextText}} <span aria-hidden="true">&rarr;</span></a></li>' +
            '</ul></nav>'+
            '</div></div></div>' +
            '</div>',
            link: function(scope, element, attrs) {
                scope.prevText =  attrs.prevText ;
                scope.nextText =  attrs.nextText ;
                scope.hideTitle = attrs.hideTitle;
                scope.currentPage = 1;

                scope.chooseOrder = function(index){
                    $window.sessionStorage.flag = scope.orderArr[index].flag;
                    $window.sessionStorage.order = scope.orderArr[index].order;
                    scope.order = $window.sessionStorage.order;
                    if(!scope.hideTitle){
                        $('#orderModal').modal('hide');
                    }else{
                        $state.go(scope.goUrl);
                    }

                };
                scope.myOrderVal = '1';
                scope.parameters = {
                    order: '',//订单号
                    mark: scope.myOrderVal, //1乐视，2大麦，3其他
                    type: 1,//1机顶盒，2路由器，3下载宝
                    limit: 5,
                    page: 1
                };
                QueryOrder.getOrderData(scope.parameters).then(function(res){
                    scope.orderArr = res.data;
                    scope.totalPage = Math.ceil(res.count/scope.parameters.limit);
                })

                scope.selectAction = function () {
                    scope.currentPage = 1;
                    scope.parameters.mark = scope.myOrderVal;
                    QueryOrder.getOrderData(scope.parameters).then(function(res){
                        scope.orderArr = res.data;
                        scope.totalPage = Math.ceil(res.count/scope.parameters.limit);
                    })
                };

                scope.pageAction = function (add) {
                    if((scope.parameters.page==1 && add==-1) || (scope.parameters.page==scope.orderArr.length && add==1 )) return;
                    scope.parameters.page += add;
                    scope.currentPage=scope.parameters.page;
                    QueryOrder.getOrderData(scope.parameters).then(function(res){
                        scope.orderArr = res.data;
                    })
                }

            }

        };
    }
]);