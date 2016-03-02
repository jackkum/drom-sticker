'use strict';

(function() {

function ItemResource(Resource) {
  return Resource.get('/api/items/:id/:controller', {}, {});
}

angular.module('stikerApp.auth')
  .factory('Item', ItemResource);

})();
