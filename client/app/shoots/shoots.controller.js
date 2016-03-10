'use strict';

(function() {

class ShootsController {
	constructor(UserService, Item, Auth, socket, $scope) {
		this.Item    = Item;
	  this.items   = [];
	  this.filter  = {
	  	limit: 20, 
	  	offset: 0
	  };
	  this.isAdmin = Auth.isAdmin;
	  this.me      = Auth.getCurrentUser();

	  socket.syncUpdates('item', this.items);

	  $scope.$on('destroy', () => {
	  	socket.unsyncUpdates('item');
	  });

	  this.load();
	}

	triggerParticipation() {
		this.participation = !this.participation;
		this.items.length  = 0;
		
		if(this.participation){
			this.filter  = {
	  		limit: 100, 
	  		offset: 0,
	  		my: true
	  	};
		} else {
			this.filter  = {
	  		limit: 20, 
	  		offset: 0
	  	};
		}

		this.load();
	}

	load() {
		var self = this;
		this.Item.query(self.filter)
			.$promise
			.then(items => {
				items.forEach(item => {
					self.items.push(item);
				});
			});
	}
}

angular.module('stikerApp')
  .controller('ShootsCtrl', ShootsController);

})();
