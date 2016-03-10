'use strict';

(function() {

class MainController {

  constructor(Auth, User, Item, socket, $scope) {
    this.me = Auth.getCurrentUser();
    this.alerts = [];

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
    var self = this;
  	this.me.$save()
      .then(() => {
        self.alerts.push({type: 'success', msg: 'Успешно сохранено'});
      })
      .catch(err => {
        console.error(err);
        self.alerts.push({type: 'danger', msg: err.message || 'Произошла ошибка при сохранении'});
      });
  }

  closeAlert(index) {
    this.alerts.splice(index, 1);
  }

}

angular.module('stikerApp')
  .controller('MainController', MainController);

})();
