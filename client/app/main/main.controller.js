'use strict';

(function() {

class MainController {

  constructor(Auth, User, Item, socket, $scope) {
    this.me = Auth.getCurrentUser();

    if(this.me && this.me.$promise){
    	var self = this;
	    this.me
	    	.$promise
	    	.then(() => {
	    		self.items = Item.query({
		  			offset: 0, 
		  			victim: self.me._id,
		  			confirm: false,
		  			cancel: false
		  		});

		  		socket.syncUpdates('items', this.items, (event, item, list) => {
		  			if(item.victim.cancel || item.victim.confirm){
		  				var index = list.indexOf(item);
		  				list.splice(index, 1);
		  			}
		  		});

				  $scope.$on('destroy', () => {
				  	socket.unsyncUpdates('item');
				  });
	    	});
    }
  }

  submit(form) {
  	this.me.$save();
  }

}

angular.module('stikerApp')
  .controller('MainController', MainController);

})();
