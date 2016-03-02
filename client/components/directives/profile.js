'use strict';

angular.module('stikerApp')
	.directive('profile', (UserService) => {
		return {
			restrict: 'E',
			scope: {
				userId: '='
			},
			link: (scope, elem) => {

				UserService.query()
				.$promise
				.then(users => {
					users.forEach(user => {
						if(user._id === scope.userId){
							var car = user.car || {model: '', mark: '', color: '', number: ''}
							elem.html(
								'<span class="user-name">' + user.name + '</span>' + 
								'<br/><small>' + car.mark + ' ' + car.model + 
								' (' + car.color + ', ' + car.number + ')' + 
								'</small>'
							);
							return false;
						}
					});
				});
			}
		};
	});