'use strict';

class NavbarController {
  //start-non-standard
  menu = [];

  isCollapsed = true;
  //end-non-standard

  constructor($location, Auth, UserService, Item, Modal, Upload) {
    this.$location      = $location;
    this.isLoggedIn     = Auth.isLoggedIn;
    this.isAdmin        = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.users          = [];
    this.reloadUsers    = UserService.reload;
    this.Item           = Item;
    this.form           = Modal.open;
    this.upload         = Upload.upload;
  }

  isActive(route) {
    return route === this.$location.path();
  }

  addItem(type, shooter, victim) {
    this.users = this.reloadUsers();

    var self  = this,
        item = new this.Item({
          dtime: new Date(),
          type: type,
          shooter: {
            id: shooter._id
          },
          victim: {
            id: victim._id
          }
        }),
        progress = {
          active: false,
          percentage: 0,
          picture: null
        },
       modal  = this.form({
      modal: {dismissable: true},
      users: this.users,
      item: item,
      me: self.getCurrentUser(),
      progress: progress,
      submit: (form) => {
        if(form.$valid){

          if(progress.picture){
            progress.active = true;
            this.upload({
              url: '/api/items/upload',
              file: progress.picture
            }).then(resp => {
              progress.active = false;
              
              if( ! resp.data.image){
                return;
              }

              item.picture = {
                url: resp.data.image.url.replace('http://', ''),
                thumb: resp.data.image.thumb.url.replace('http://', ''),
              };
              item.$save();
              modal.close();
            }, resp => {
              //console.log('Error status: ' + resp.status);
              progress.active = false;
            }, evt => {
              progress.percentage = parseInt(100.0 * evt.loaded / evt.total);
            });
          } else {
            item.$save();
            modal.close();
          }
        }
      }
    }, 'modal-default', 'components/forms/item.form.html');
  }
}

angular.module('stikerApp')
  .controller('NavbarController', NavbarController);
