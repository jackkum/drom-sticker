'use strict';

import config from '../config/environment';
import User from '../api/user/user.model';
import _ from 'lodash';
import request from 'request';
import crypto from 'crypto';

var FileCookieStore = require('tough-cookie-filestore');
var j = request.jar(new FileCookieStore('../config/cookies.json'));

var req = request.defaults({jar: j});

export function getThemeParams(theme) {
	return new Promise((resolve, reject) => {
		
		req.get({
				url: 'http://forums.drom.ru/irkutsk/t' + theme + '.html',
				headers: {'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'}
			}, function(err, responce, body){
				
				if(err){
					return reject(err);
				}

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
					var match = body.match(reg);

					if( ! match){
						throw new Error('Find ' + name + ' not found');
					}

					post[name] = match[1];
				});

				['posthash', 'poststarttime'].forEach(function(name){
					var reg   = new RegExp('"' + name + '":"([^"]*)"');
					var match = body.match(reg);

					if( ! match){

						var reg   = new RegExp('"' + name + '":([^,]*)');
						var match = body.match(reg);

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

export function postAttachment(theme, attachment) {
	console.log("Check auth...");
	return isLoggedIn()
		.then(loggedIn => {
			if(loggedIn){
				return;
			}

			console.log("authenticate...");
			return authenticate();
		})
		.then(() => {
			console.log("get theme params...");
			return getThemeParams(theme)
				.then(post => {
					console.log("Insert attachment...");
					return insertAttachment(theme, attachment, post);
				})
		});
}

export function postMessage(message, theme) {
	return isLoggedIn()
		.then(loggedIn => {
			if(loggedIn){
				return;
			}

			return authenticate();
		})
		.then(() => {
			return getThemeParams(theme)
				.then(post => {

					post.message_backup = message;
					post.message        = message;

					return insertPost(theme, post);
				})
		});
}

export function insertAttachment(theme, attachment, post) {
	return new Promise(function(resolve, reject){

		delete post.ajax_lastpost;
		delete post.message_backup;
		delete post.message;
		delete post.wysiwyg;
		delete post.signature;
		delete post.fromquickreply;
		delete post.t;
		delete post.p;
		delete post.specifiedpost;
		delete post.parseurl;
		delete post.loggedinuser;

		post.do                = 'manageattach';
		post.flash             = 0;
		post.upload            = 1;
		post.s                 = '';
		post.contenttypeid     = 1;
		post.MAX_FILE_SIZE     = '';
		post['values[t]']      = theme;
		post['values[theend]'] = 'fin';
		post.ajax              = 1;
		post['attachment[]']   = attachment;

		console.log(post);
		console.log(j.getCookies('http://forums.drom.ru'));

		req.post({
			url: 'http://forums.drom.ru/newattachment.php',
			formData: post,
			headers: {
				referer: 'http://forums.drom.ru/irkutsk/t' + theme + '.html'
			}
		}, function (err, resp, body) {
	    if (err) {
	      return reject(err);
	    }

	    console.log(body);

	    var reg   = new RegExp('<attachmentid>([0-9]*)</attachmentid>');
			var match = body.match(reg);

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
				'referer': 'http://forums.drom.ru/irkutsk/t' + theme + '.html'
			},
			form: post
		}, function(err, responce, body){
			if(err){
				return reject(err);
			}

			console.log("Message sent");
			return resolve();
		});
	});
}

export function sendMessage(userId, title, message) {  

	console.log("Search user...");
	return User.findByIdAsync(userId)
		.then(user => {
			if( ! user){
				throw new Error('User not found');
			}

			console.log("User finded! Test is logged in");
			return isLoggedIn()
				.then(loggedIn => {
					if(loggedIn){
						console.log("Bot is logged in, continue");
						return user;
					}

					console.log("Authenticate a bot...");
					return authenticate()
						.then(() => {
							return user;
						});
				});
		})
		.then(user => {
			return new Promise((resolve, reject) => {
				console.log("Start send message...");
				console.log('http://forums.drom.ru/private.php?do=newpm&u=' + user.dromId);
				req.get({
					url: 'http://forums.drom.ru/private.php?do=newpm&u=' + user.dromId,
					headers: {'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'}
				}, function(err, responce, body){
					if(err){
						return reject(err);
					}

					var match = body.match(/\<input type=\"hidden\" name=\"securitytoken\" value=\"([^"]*)\" \/>/);

					if( ! match){
						return reject(new Error('No security token found'));
					}

					var token = match[1];

					req.post({
						url: 'http://forums.drom.ru/private.php?do=insertpm&pmid=',
						headers: {'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'},
						form: {
							recipients: user.name,
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
						return resolve();
					});
				});
			});
		});
	
}

export function isLoggedIn() {
	return new Promise((resolve, reject) => {
		req.get({
			url: 'http://forums.drom.ru/usercp.php',
			headers: {'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'}
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
			headers: {'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:42.0) Gecko/20100101 Firefox/42.0'},
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