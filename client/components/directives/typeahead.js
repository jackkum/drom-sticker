'use strict';

angular.module('stikerApp')
.directive('typeahead', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attr, ctrl) {
			element.bind('click', function () {
				element.val(' ').trigger('input');
			});
			element.bind('blur', function () {
				if(element.val() === ' '){
					element.val('').trigger('input');
				}
			});
		}
	};
});