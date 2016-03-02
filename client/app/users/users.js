'use strict';

angular.module('stikerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/users', {
        templateUrl: 'app/users/users.html',
        controller: 'UsersCtrl',
        controllerAs: 'users',
        authenticate: 'user'
      });
  });
