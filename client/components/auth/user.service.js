'use strict';

(function() {

function UserResource(Resource) {
  return Resource.get('/api/users/:id/:controller', {}, {
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    invite: {
      method: 'GET',
      params: {
      	controller: 'invite'
      }
    }
  });
}

angular.module('stikerApp.auth')
  .factory('User', UserResource);

})();
