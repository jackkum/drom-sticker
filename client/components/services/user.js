'use strict';

angular.module('stikerApp')
	.factory('UserService', function(User){
		var users = undefined,
			query = function() {
				if( ! users){
					users = User.query();

					users.$promise.catch(err => {
						users = undefined;
					});
				}
				
				return users;
			},

			reload = function() {
				users = undefined;
				return query();
			};


		return {
			reload: reload,
			query: query
		};
	})
