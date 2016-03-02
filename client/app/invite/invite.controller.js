'use strict';

(function() {

class InviteController {
	constructor(User, $route, $location) {
	  var hash = $route.current.params.hash,
	  		self = this;

	  if( ! hash){
	  	return $location.path('/');
	  }

	  User.invite({id: hash})
	  	.$promise
	  	.then(user => {
	  		if( ! user){
	  			console.error("User not found by hash: " + hash);
	  			return $location.path('/');
	  		}

	  		self.user = user;
	  	})
	  	.catch(err => {
	  		console.error(err);
	  		return $location.path('/');
	  	});
	}
}

angular.module('stikerApp')
  .controller('InviteCtrl', InviteController);

})();
