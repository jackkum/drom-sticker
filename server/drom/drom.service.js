'use strict';

import config from '../config/environment';
import User from '../api/user/user.model';
import _ from 'lodash';
import request from 'request';
import crypto from 'crypto';

var req = request.defaults({jar: true});

export function getTheme(theme, page) {
	return new Promise((resolve, reject) => {
		req.get({
				url: 'http://forums.drom.ru/irkutsk/t' + theme + (page && page > 1 ? '-p' + page : '') + '.html',
				headers: {
					'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'
				}
			}, function(err, responce, body){
				
				if(err){
					return reject(err);
				}

				resolve(responce);
			});
	});
}

export function getThemeParams(theme) {

	return getTheme(theme)
		.then(responce => {
			return new Promise((resolve, reject) => {
				var post = {
					securitytoken: "",
					ajax: "1",
					ajax_lastpost: "",
					message_backup: "",
					message: "",
					wysiwyg: "0",
					signature: "1",
					fromquickreply: "1",
					s: "",
					do: "postreply",
					t: theme,
					p: "who cares",
					specifiedpost: "0",
					parseurl: "1",
					loggedinuser: "",
					posthash: "",
					poststarttime: ""
				};

				['loggedinuser', 'securitytoken'].forEach(function(name){
					var reg   = new RegExp('<input type="hidden" name="' + name + '" value="([^"]*)" />');
					var match = responce.body.match(reg);

					if( ! match){
						throw new Error('Find ' + name + ' not found');
					}

					post[name] = match[1];
				});

				['posthash', 'poststarttime'].forEach(function(name){
					var reg   = new RegExp('"' + name + '":"([^"]*)"');
					var match = responce.body.match(reg);

					if( ! match){

						var reg   = new RegExp('"' + name + '":([^,]*)');
						var match = responce.body.match(reg);

						if( ! match){
							throw new Error('Find ' + name + ' not found');
						}
					}

					post[name] = match[1];
				});

				resolve(post);
			});
		});
}

export function getUploadParams(theme, token) {

	return new Promise((resolve, reject) => {
		
		req.post({
				url: 'http://forums.drom.ru/ajax.php',
				form: {
					ajax:"1",
					do:"fetchhtml",
					template:"editor_upload_overlay",
					securitytoken: token
				},
				headers: {
					referer: 'http://forums.drom.ru/irkutsk/t' + theme + '.html',
					'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'
				}
			}, function(err, responce, body){
				
				if(err){
					return reject(err);
				}

				var post = {
					do: "",
					flash: "",
					upload: "",
					s: "",
					securitytoken: "",
					poststarttime: "",
					posthash: "",
					contenttypeid: "",
					MAX_FILE_SIZE: ""
				};

				['do', 'flash', 'upload', 's', 'securitytoken', 'poststarttime', 'posthash', 'contenttypeid', 'MAX_FILE_SIZE'].forEach(function(name){
					var reg   = new RegExp('<input type="hidden" name="' + name + '" value="([^"]*)" />');
					var match = body.match(reg);

					if( ! match){
						throw new Error('Find ' + name + ' not found');
					}

					post[name] = match[1];
				});

				resolve(post);
		});

	});
}

export function postAttachment(theme, attachment) {
	var themeParams = {};
	return login()
		.then(() => {
			return getThemeParams(theme);
		})
		.then(params => {
			themeParams = params;
			return getUploadParams(theme, params.securitytoken);
		})
		.then(post => {
			return insertAttachment(theme, attachment, post);
		})
		.then(attachmentId => {
			return new Promise(function(resolve){
				resolve({attachmentId: attachmentId, params: themeParams});
			});
		});
}

export function postMessage(message, theme, params) {
	return login()
		.then(() => {
			if( ! params){
				return getThemeParams(theme);
			}

			return params;
		})
		.then(params => {
				params.message_backup = message;
				params.message        = message;

				return insertPost(theme, params);
			});
}

export function insertAttachment(theme, attachment, post) {
	return new Promise(function(resolve, reject){

		post.ajax               = 1;
		post.flash              = 1;
		post.upload             = 1;
		post.contenttypeid      = 1;
		post['values[t]']       = theme;
		post['values[theend]']  = 'fin';
		post['attachmenturl[]'] = attachment;

		req.post({
			url: 'http://forums.drom.ru/newattachment.php',
			formData: post,
			headers: {
				referer: 'http://forums.drom.ru/irkutsk/t' + theme + '.html',
				'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'
			}
		}, function (err, resp, body) {
	    if (err) {
	      return reject(err);
	    }

	    if(body.indexOf("error: ") !== -1){
	    	var error = body.split(":")[1];
	    	return reject(new Error(error || "Ошибка добавления картинки"));
	    }

	    var match = body.match(/ok - ([0-9]*) - ([0-9]*)/);

			if( ! match){
				return reject(new Error('Attachment id not found'));
			}
    
    	// [ATTACH=CONFIG]*[/ATTACH]
	    resolve(match[1]);
  	});
	});
}

export function insertPost(theme, post) {
	return new Promise(function(resolve, reject){
		req.post({
			url: 'http://forums.drom.ru/newreply.php?do=postreply&t=' + theme,
			headers: {
				'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0',
				'referer': 'http://forums.drom.ru/irkutsk/t' + theme + '.html',
				'X-Requested-With':"XMLHttpRequest"
			},
			form: post
		}, function(err, responce, body){
			if(err){
				return reject(err);
			}

			return resolve();
		});
	});
}

export function sendMessage(dromId, title, message) {  

	return login()
		.then(() => {
			return new Promise((resolve, reject) => {
				req.get({
					url: 'http://forums.drom.ru/private.php?do=newpm&u=' + dromId,
					headers: {
						'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'
					}
				}, function(err, responce, body){
					if(err){
						return reject(err);
					}

					var match = body.match(/\<input type=\"hidden\" name=\"securitytoken\" value=\"([^"]*)\" \/>/);

					if( ! match){
						return reject(new Error('No security token found'));
					}

					var token = match[1];

					match = body.match(/\<textarea class=\"primary full textbox popupctrl\" id=\"pmrecips_ctrl\" name=\"recipients\" rows=\"1\" cols=\"50\"  tabindex=\"1\"\>([^<]*)\<\/textarea\>/);

					if( ! match){
						return reject(new Error('No security token found'));
					}

					var nikname = match[1];

					req.post({
						url: 'http://forums.drom.ru/private.php?do=insertpm&pmid=',
						headers: {
							'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'
						},
						form: {
							recipients: nikname,
							bccrecipients:"",
							title: title,
							message_backup: message,
							message: message,
							wysiwyg:"0",
							s:"",
							securitytoken: token,
							do:"insertpm",
							pmid:"",
							forward:"",
							sbutton:"Отправить+сообщение"
						}
					}, function(err, responce, body){
						if(err){
							return reject(err);
						}

						console.log("Message sent");
						return resolve(nikname);
					});
				});
			});
		});
	
}

export function isLoggedIn() {
	return new Promise((resolve, reject) => {
		req.get({
			url: 'http://forums.drom.ru/usercp.php',
			headers: {
				'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'
			}
		}, function(err, responce, body){
			if(err){
				return reject(err);
			}

			if(body.indexOf(config.drom.login) !== -1){
				return resolve(true);
			}

			return resolve(false);
		});
	});
}
export function authenticate() {
	return new Promise((resolve, reject) => {
		var md5 = crypto.createHash('md5')
										.update(config.drom.password)
										.digest('hex');
		req.post({
			url: 'http://forums.drom.ru/login.php?do=login',
			headers: {
				'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'
			},
			form: {
				vb_login_username: config.drom.login,
				vb_login_password: "",
				vb_login_password_hint: "Пароль",
				cookieuser: "1",
				s: "",
				securitytoken: "guest",
				do: "login",
				vb_login_md5password: md5,
				vb_login_md5password_utf: md5,
			}
		}, function(err, responce, body){
			if(err){
				return reject(err);
			}

			return resolve();
		});
	});
}

export function login() {
	return isLoggedIn()
		.then(loggedIn => {
			if(loggedIn){
				return;
			}

			return authenticate();
		});
}