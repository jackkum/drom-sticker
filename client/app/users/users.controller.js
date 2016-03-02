'use strict';

angular.module('stikerApp')
  .controller('UsersCtrl', function ($scope) {
    $scope.message = 'Hello';
  });

'use strict';

(function() {

class UsersController {
	constructor(UserService, Auth, socket, $scope) {
	  this.users   = UserService.query();
	  this.isAdmin = Auth.isAdmin;
	  this.me      = Auth.getCurrentUser();
	  this.search  = '';

	  socket.syncUpdates('user', this.users);

	  $scope.$on('destroy', () => {
	  	socket.unsyncUpdates('user');
	  });
	}

	searchFilter() {
		var self = this;
		return user => {
			var car = user.car || {mark: '', model: '', color: '', number: ''},
				words = self.search.split(' ').map(word => {
					return word.toLowerCase();
				});

			return words.filter(word => {
				return user.name.toLowerCase().indexOf(word)  !== -1 || 
							 user.email.toLowerCase().indexOf(word) !== -1 || 
							 car.mark.toLowerCase().indexOf(word)   !== -1 || 
							 car.model.toLowerCase().indexOf(word)  !== -1 || 
							 car.color.toLowerCase().indexOf(word)  !== -1 || 
							 car.number.toLowerCase().indexOf(word) !== -1;
			}).length > 0;

		};
	}
}

angular.module('stikerApp')
  .controller('UsersCtrl', UsersController);

})();
