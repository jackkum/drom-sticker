'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var feedCtrlStub = {
  index: 'feedCtrl.index',
  show: 'feedCtrl.show',
  create: 'feedCtrl.create',
  update: 'feedCtrl.update',
  destroy: 'feedCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var feedIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './feed.controller': feedCtrlStub
});

describe('Feed API Router:', function() {

  it('should return an express router instance', function() {
    expect(feedIndex).to.equal(routerStub);
  });

  describe('GET /api/feeds', function() {

    it('should route to feed.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'feedCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/feeds/:id', function() {

    it('should route to feed.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'feedCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/feeds', function() {

    it('should route to feed.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'feedCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/feeds/:id', function() {

    it('should route to feed.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'feedCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/feeds/:id', function() {

    it('should route to feed.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'feedCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/feeds/:id', function() {

    it('should route to feed.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'feedCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
