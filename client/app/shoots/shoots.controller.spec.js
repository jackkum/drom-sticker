'use strict';

describe('Controller: ShootsCtrl', function () {

  // load the controller's module
  beforeEach(module('stikerApp'));

  var ShootsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShootsCtrl = $controller('ShootsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
