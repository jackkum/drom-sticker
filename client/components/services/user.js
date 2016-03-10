'use strict';

angular.module('stikerApp')
	.factory('UserService', function(User, socket){
		var users = undefined,
			query = function() {
				if( ! users){
					users = User.query();

					users.$promise.catch(err => {
						users = undefined;
						socket.unsyncUpdates('user');
					});

					socket.syncUpdates('user', users);
				}
				
				return users;
			},

			reload = function() {
				users = undefined;
				socket.unsyncUpdates('user');
				return query();
			};


		return {
			reload: reload,
			query: query
		};
	})
