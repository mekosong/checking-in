/**
 * Created by Administrator on 2017/1/19.
 */
angular.module('services')
  .factory('FlagInterceptor',function($q, $window,$rootScope,Global) {
    return {
      request: function (config) {
        config.headers = config.headers || {};

        //将token增加到请求头的authorization 字段
        if ($window.sessionStorage.flag) {
          var host = config.url.split('?')[0];
          if(host!==Global.boxHost){
            config.headers.flag = $window.sessionStorage.flag;
          }
        }
        return config;
      },

      response: function (response) {
        var data = response.data;
        if (data.code && data.code == 10004) {
          $rootScope.$emit("notification", {type: 'danger',status:1, message: '登录信息失效'});
        }

        if (data.code && data.code == 10014) {
          $rootScope.$emit("notification", {type: 'danger',status:2, message: '请选择订单'});
        }

        return response || $q.when(response);
      },
      responseError: function (response) {
        return $q.reject(response);
      }
    };
  });
