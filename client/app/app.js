'use strict';

angular.module('stikerApp', [
  'stikerApp.auth',
  'stikerApp.admin',
  'stikerApp.constants',
  'stikerApp.resource',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'angular-momentjs',
  'btford.socket-io',
  'ui.bootstrap',
  'validation.match',
  'ngFileUpload'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
