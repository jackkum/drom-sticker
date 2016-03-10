'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.post('/code', controller.code);
router.get('/avatar/:id', controller.avatar);

router.get('/',             auth.isAuthenticated(),   controller.index);
router.delete('/:id',       auth.hasRole('admin'),    controller.destroy);
router.get('/me',           auth.isAuthenticated(),   controller.me);
router.put('/:id',          auth.hasRoleAdminOrAmI(), controller.update);
router.put('/:id/password', auth.isAuthenticated(),   controller.changePassword);
router.put('/:id/invite',   auth.hasRole('admin'),    controller.invite);
router.get('/:id',          auth.isAuthenticated(),   controller.show);
router.post('/',            auth.hasRole('admin'),    controller.create);

export default router;
