'use strict';



(function() {

class ResultsController {
	constructor(UserService, Item, Auth, $scope, $moment, $q) {
	  this.users       = UserService.query();
	  this.Item        = Item;
	  this.promiseAll  = $q.all;
	  this.filter      = {
	  	sd: $moment().startOf('month').toDate(),
	  	ed: new Date()
	  };
	  
	  this.isAdmin     = Auth.isAdmin;
	  this.me          = Auth.getCurrentUser();
	  this.isCollapsed = true;
	  this.sortCol     = {
	  	shooter: '-score.shooter',
	  	victim: '-score.victim'
	  };

	  this.reload();
	}

	reload(){
		var self   = this;
		this.items = this.Item.query({
			offset: 0, 
			confirmed: true,
			sd: this.filter.sd, 
			ed: this.filter.ed
		});

		this.promiseAll([
			this.items.$promise,
			this.users.$promise
		]).then(() => {
			self.users.forEach((user, index) => {
				
				user.score = {
					shooter: 0,
					victim: 0
				};

				user.shoots = {
					hits: 0,
					wounds: 0
				};

				user.mines = {
					hits: 0,
					wounds: 0
				};

				self.items.forEach(item => {
					if( ! item.victim || !item.victim.confirm){
						return;
					}

					if(user._id === item.shooter.id){
						user.score.shooter++;

						switch(item.type){
							case 'shoot': user.shoots.hits++; break;
							case 'mine':  user.mines.hits++; break;
						}
					}

					if(user._id === item.victim.id){
						user.score.victim++;

						switch(item.type){
							case 'shoot': user.shoots.wounds++; break;
							case 'mine':  user.mines.wounds++; break;
						}
						
					}
				});

				self.users[index] = user;
			});
		});
	}
}


angular.module('stikerApp')
  .controller('ResultsCtrl', ResultsController);

})();

