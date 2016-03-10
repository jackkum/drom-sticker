/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/items              ->  index
 * POST    /api/items              ->  create
 * GET     /api/items/:id          ->  show
 * PUT     /api/items/:id          ->  update
 * DELETE  /api/items/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Item from './item.model';
import request from 'request';
import fs from 'fs';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
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

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Items
export function index(req, res) {
  var offset = req.query.offset || 0,
      limit  = req.query.limit,
      type   = req.query.type,
      my     = req.query.my,
      where  = {};

  console.log(req.query);
  if(req.query.sd && req.query.ed){
    where.dtime = {
      $gte: new Date(req.query.sd),
      $lte: new Date(req.query.ed)
    };
  }

  if(type){
    where.type = type;
  }

  if(req.query.confirm !== undefined){
    where['victim.confirm'] = req.query.confirm === 'true';
  }

  if(req.query.cancel !== undefined){
    where['victim.cancel'] = req.query.cancel === 'true';
  }

  if(req.query.victim){
    where['victim.id'] = req.query.victim;
  }

  if(my){
    where.$or = [
      {'shooter.id': req.user._id},
      {'victim.id': req.user._id}
    ];
  }

  console.log(where);

  Item.find()
    .where(where)
    .skip(parseInt(offset, 10))
    .sort('-dtime')
    .limit(parseInt(limit, 10))
    .execAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Item from the DB
export function show(req, res) {
  Item.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Item in the DB
export function create(req, res) {
  Item.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Item in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Item.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Item from the DB
export function destroy(req, res) {
  Item.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function upload(req, res) {

  var picture = req.files.file;
  
  if( ! picture){
    return res.status(500).json({message:'Image not found'});
  }

  var _req = request.post('http://ultraimg.com/api/1/upload/?key=3374fa58c672fcaad8dab979f7687397&format=json', function (err, resp, body) {
    if (err) {
      return res.status(500).json(err);
    }
    
    try {
      var result = JSON.parse(body);
      res.status(200).json(result);
    } catch(err){
      return res.status(500).json(err);
    }
    
  });
  
  var form = _req.form();
  form.append('source', fs.readFileSync(picture.path), {
    filename: picture.name,
    contentType: picture.type
  });
}

export function image(req, res) {
  Item.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(function(item){
    
      if( ! item.picture){
        return res.status(404).end();
      }

      if( ! item.picture.url){
        return res.status(404).end();
      }
    
      request.get('http://' + item.picture.url).pipe(res);
    })
    .catch(handleError(res));
}

export function thumb(req, res) {
  Item.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(function(item){
    
      if( ! item.picture){
        return res.status(404).end();
      }

       if( ! item.picture.thumb){
        return res.status(404).end();
      }
    
      request.get('http://' + item.picture.thumb).pipe(res);
    })
    .catch(handleError(res));
}