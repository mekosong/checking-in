
angular.module('services')
    .factory('QueryOrder', ['$http','$rootScope',function($http,$rootScope) {
        return {
            getOrderData: function (parameters) {
                var resObj=[];
                return $http.get('/api/orders',{params:parameters})
                    .then(function (response) {
                        if(response.data.code == 0){
                            var resObj = response.data;
                            return resObj;
                        }else{
                            $rootScope.$emit('notification', {
                                type: 'danger',
                                message: response.data.data.msg
                            });
                            return []
                        }
                    },function(response){
                        $rootScope.$emit('notification', {
                            type: 'danger',
                            message: '网络错误，提交失败'
                        });
                        return []
                    })


            }
        }
        
    }]);
