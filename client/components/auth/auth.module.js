'use strict';

angular.module('stikerApp.auth', [
  'stikerApp.constants',
  'stikerApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
