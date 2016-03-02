'use strict';

describe('Controller: ResultsCtrl', function () {

  // load the controller's module
  beforeEach(module('stikerApp'));

  var ResultsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResultsCtrl = $controller('ResultsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
