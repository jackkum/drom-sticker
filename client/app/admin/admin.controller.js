'use strict';

(function() {

class AdminController {
  constructor(UserService, User, Modal, Item, socket, $scope) {
    // Use the User $resource to fetch all users
    this.users   = UserService.query();
    this.confirm = Modal.confirm;
    this.form    = Modal.open;
    this.reload  = User.get;
    this.User    = User;
    this.Item    = Item;
  }

  delete(user) {

    if( ! (user instanceof this.User)){
      user = new this.User(user);
    }

  	this.confirm(
  		'Подтвердить удаление', 
  		'<p>Удалить пользователя <strong>' + user.name + '</strong> ?</p>'
  	).result.then(() => {
			user.$remove();
  	});
  }

  getForm(user, index) {
    user = user || new this.User();

    if( ! (user instanceof this.User)){
      user = new this.User(user);
    }

    var self = this,
  	   modal = this.form({
  		modal: {dismissable: true},
  		user: user,
  		submit: (form) => {
        if(form.$valid){
          if(user.password && user.password.length === 0){
            user.password = undefined;
          }
          
          user.$save();
          modal.close();
        }
  		}
  	}, 'modal-default', 'components/forms/admin.form.html');

    modal.result.then(undefined, () => {
      if(user && user._id){
        self.users[index] = self.reload({id: user._id});
      }
    });
  }

  addInvite() {
    var user = new this.User({
      provider: 'invite'
    });

    var modal = this.form({
      modal: {dismissable: true},
      user: user,
      submit: (form) => {
        if(form.$valid){
          user.$save();
          modal.close();
        }
      }
    }, 'modal-default', 'components/forms/invite.form.html');
  }

  sendInvite(user) {
    this.User.invite(user);
  }
}

angular.module('stikerApp.admin')
  .controller('AdminController', AdminController);

})();
