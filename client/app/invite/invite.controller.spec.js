'use strict';

describe('Controller: InviteCtrl', function () {

  // load the controller's module
  beforeEach(module('stikerApp'));

  var InviteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InviteCtrl = $controller('InviteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
