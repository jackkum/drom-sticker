'use strict';

angular.module('stikerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/invite', {
        templateUrl: 'app/invite/invite.html',
        controller: 'InviteCtrl',
        controllerAs: 'invite'
      });
  });
