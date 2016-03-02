'use strict';

angular.module('stikerApp')
	.directive('user', (UserService) => {
		console.log(UserService);
		return {
			restrict: 'E',
			scope: {
				userId: '='
			},
			link: (scope, elem) => {
				console.log(scope.userId);
				elem.text(scope.userId);
			}
		};
	});