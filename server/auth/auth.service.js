'use strict';

import passport from 'passport';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import request from 'request';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user/user.model';

var validateJwt = expressJwt({
  secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }

      //if(req.headers['user-agent'].indexOf("MSIE") >= 0){
      //  var aux   = req.headers.cookie.split(';');
      //  var token = aux[aux.length-1].trim().replace('token=','');
      //  req.headers.authorization = 'Bearer ' + token;
      //}

      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findByIdAsync(req.user._id)
        .then(user => {
          if (!user) {
            return res.status(401).end();
          }
          req.user = user;
          next();
        })
        .catch(err => next(err));
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired, noCompose) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  if(noCompose){
    return config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired);
  }

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >=
          config.userRoles.indexOf(roleRequired)) {
        next();
      } else {
        res.status(403).send('Forbidden');
      }
    });
}

export function hasRoleAdminOrAmI() {
  
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirementsOrAmI(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >=
          config.userRoles.indexOf('admin') || 
          req.user._id.equals(req.body._id)) {
        next();
      } else {
        res.status(403).send('Forbidden');
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
  return jwt.sign({ _id: id, role: role }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
}

export function verifiReCaptcha(response, ip) {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: 'https://www.google.com/recaptcha/api/siteverify',
        form: {
          secret: config.recaptchaSecret,
          response: response,
          remoteip: ip
        }
      }, (err, httpResponse, body) => {
        if (err) {
          return reject(err);
        }

        try {
          var result = JSON.parse(body);

          if( ! result || ! result.success){
            return reject(new Error("Не удалось пройти проверку"));
          }

          return resolve(result);

        } catch (e) {
          return reject(new Error("Не удалось пройти проверку"));
        }
      }
    );
  });
}