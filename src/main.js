/**
 * I'm the King of the World!
 */
angular.module('productionTest', [
    'ngAnimate',
    'ipCookie',
    'ui.router',
    'ngFileUpload',
    'controllers',
    'services',
    'directives',
    'filters',
    'views'
  ])
  .constant('Global', {
    boxHost: 'http://192.168.8.105'
  })
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
      'use strict';

      // 修改默认请求头
      $httpProvider.defaults.headers.common = {'content-type': 'application/json;charset=utf-8'};

      //去除ie缓存
      if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
      }
      $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
      $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

      // 拦截器，在请求头自动加上flag
      $httpProvider.interceptors.push('FlagInterceptor');

      // 开启 HTML5 模式
      $locationProvider.html5Mode(true);

      // 将所有未匹配路由转至根目录
      $urlRouterProvider.otherwise(function ($injector) {
        $injector.get('$state').go('main')
      });

      // 路由
      $stateProvider
      // PE登录
        .state('login', {
          url: '^/main/login',
          controller: "loginCtr",
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('login.view.html');
          }],
          resolve: {
            //checkInstallResolve: ['checkInstallResolve', function (resolve) {
            //  return resolve.enterToInstallOrNone()
            //}],
          }
        })

        // 产测登录
        .state('main', {
          url: '^/main',
          controller: 'mainController',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('main.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })
        .state('newOrder', {
          url: '^/main/newOrder',
          controller: 'newOrder',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('new-order.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })

        .state('signIn', {
          url: '^/main/signIn',
          controller: 'mainController',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('main.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })


        .state('repair', {
          url: '^/main/repair',
          controller: 'repairController',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('repair.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })
        .state('printBoxNum', {
          url: '^/main/printBoxNum',
          controller: "printController",
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('printBoxNum.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })
        .state('inStorage', {
          url: '^/main/inStorage',
          controller: "inStorageCtrl",
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('inStorage.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })
        .state('exStorage', {
          url: '^/main/exStorage',
          controller: "exStorageCtrl",
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('exStorage.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })
        .state('chooseOrder', {
          url: '^/main/chooseOrder',
          params: {Url: null},
          controller: 'chooseOrderCtr',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('chooseOrder.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })
        .state('burnNumber', {
          url: '^/main/burnNumber',
          controller: "burnNumberCtrl",
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('shaohao.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })
        .state('checkNumber', {
          url: '^/main/checkNumber',
          controller: "checkNumberCtrl",
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('yanhao.view.html');
          }],
          resolve: {
            //account: 'account'
          }
        })

    }
  ]);

//  .run(['checkSignIn', '$templateCache',function (checkSignIn) {
//    // 检查用户是否登录
//    checkSignIn();
//
//}]);

/**
 * 创建 Controllers, Services, Directives, Filters 模块
 */
angular.module('controllers', []);
angular.module('services', []);
angular.module('directives', []);
angular.module('filters', []);
angular.module('views', []);