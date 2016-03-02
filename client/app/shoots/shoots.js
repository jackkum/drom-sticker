'use strict';

angular.module('stikerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/shoots', {
        templateUrl: 'app/shoots/shoots.html',
        controller: 'ShootsCtrl',
        controllerAs: 'shoots',
        authenticate: 'user'
      });
  });
