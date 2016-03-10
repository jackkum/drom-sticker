'use strict';

import _ from 'lodash';
import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import * as drom from '../../drom/drom.service';
import * as auth from '../../auth/auth.service';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      entity.salt     = undefined;
      entity.password = undefined;

      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(user, updates) {
  return function(entity) {

    // only admin can change the role
    if( ! auth.hasRole('admin', true)){
      updates.role = entity.role;
    }

    if(updates.provider === 'invite'){
      updates.provider === 'local';
    }

    var updated = _.merge(entity, updates);
    updated.invite = {};

    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  User.findAsync({}, '-salt -password -invite')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.saveAsync()
    .spread(function(user) {
      //var token = jwt.sign({ _id: user._id }, config.secrets.session, {
      //  expiresIn: 60 * 60 * 5
      //});

      delete newUser.salt;
      delete newUser.password;
      delete newUser.invite;

      res.json({newUser});
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  User.findByIdAsync(userId, '-salt -password -invite')
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  User.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findByIdAsync(userId)
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

// Updates an existing User in the DB
export function update(req, res) {
  var userId = req.body._id;
  if (req.body._id) {
    delete req.body._id;
  }

  if(req.body.password !== undefined && req.body.password.length === 0){
    delete req.body.password;
  }

  User.findByIdAsync(userId)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.user, req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function code(req, res, next) {
  var code  = req.body.code,
    captcha = req.body.captcha;

  auth.verifiReCaptcha(captcha, req.connection.remoteAddress)
    .then(result => {
      return User.findOneAsync({'invite.code': code}, '-salt -password');
    })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(404).end();
      }

      user.invite = user.invite || {};
      user.invite.token = auth.signToken(user._id, user.role);

      res.json(user);
    })
    .catch(err => next(err));
}

export function invite(req, res, next) {
  var id = req.params.id;
  User.findOneAsync({ _id: id })
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }

      if( ! user.dromId){
        return res.status(500).end();
      }

      if( ! user.invite.code){
        user.invite.code = user.makeHash();
        return user.save()
          .then(err => {
            if(err){
              throw err;
            }

            return user;
          });
      }
      
      return user;
    })
    .then(user => {
      return drom.sendMessage(
        user.dromId, 
        "Приглашение в игру \"Выстрел в стикер\"", 
        "[URL=\"https://drom-sticker.herokuapp.com/invite?code=" + user.invite.code + "\"]Вступить в ряды[/URL]\n\n[URL=\"http://forums.drom.ru/irkutsk/t" + config.drom.theme + ".html\"]Подробнее тут[/URL]"
      )
      .then(nikname => {
        res.json({nikname: nikname});
      });
    })
    .catch(err => next(err));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  User.findOneAsync({ _id: userId }, '-salt -password -invite')
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
