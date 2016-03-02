'use strict';

angular.module('stikerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/results', {
        templateUrl: 'app/results/results.html',
        controller: 'ResultsCtrl',
        controllerAs: 'results',
        authenticate: 'user'
      });
  });
