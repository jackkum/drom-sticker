'use strict';

var express    = require('express');
var controller = require('./item.controller');
var auth       = require('../../auth/auth.service');
var router     = express.Router();
var multipart  = require('connect-multiparty');
var middleware = multipart();

router.post('/upload', auth.hasRole('user'), middleware,  controller.upload);

router.get('/image/:id', controller.image);
router.get('/thumb/:id', controller.thumb);

router.get('/',        auth.hasRole('user'),  controller.index);
router.get('/:id',     auth.hasRole('user'),  controller.show);
router.post('/',       auth.hasRole('user'),  controller.create);
router.put('/:id',     auth.hasRole('user'),  controller.update);
router.patch('/:id',   auth.hasRole('user'),  controller.update);
router.delete('/:id',  auth.hasRole('admin'), controller.destroy);

module.exports = router;
