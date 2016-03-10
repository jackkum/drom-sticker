'use strict';

(function() {

class InviteController {
	constructor(Auth, User, $route, $location, appConfig) {
	  var code = $route.current.params.code;

	  this.captchaResponse = '';
		this.captchaWidgetId = null;
		
		this.code       = code ? parseInt(code, 10) : undefined;
	  this.Auth       = Auth;
	  this.User       = User;
	  this.location   = $location;
	  this.captchaKey = appConfig.recaptchaSite;
	}

	setWidgetId(widgetId) {
		this.captchaWidgetId = widgetId;
	}

	setResponse(response) {
			this.captchaResponse = response;
	}

	load(form) {

		if( ! form.$valid){
			return;
		}

		// hide invite form
		this.inviteForm = false;
		// get self instance
		var self = this;

		// load user by hash
		this.User.code({code: this.code, captcha: this.captchaResponse})
	  	.$promise
	  	.then(user => {
	  		if( ! user){
	  			return console.error("User not found by hash: " + self.code);
	  		}

	  		self.inviteForm = true;
	  		self.user = user;
	  		self.Auth.putToken(user.invite.token);
				self.Auth.reload();

				self.location.path('/');
	  	})
	  	.catch(err => {
	  		return console.error(err);
	  	});
	}
}

angular.module('stikerApp')
  .controller('InviteCtrl', InviteController);

})();
