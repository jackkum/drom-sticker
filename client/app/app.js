'use strict';

angular.module('stikerApp', [
  'stikerApp.auth',
  'stikerApp.admin',
  'stikerApp.constants',
  'stikerApp.resource',
  'angular-loading-bar',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'angular-momentjs',
  'btford.socket-io',
  'ui.bootstrap',
  'validation.match',
  'ngFileUpload',
  'vcRecaptcha'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
