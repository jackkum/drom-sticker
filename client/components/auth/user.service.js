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
    code: {
      method: 'POST',
      params: {
        controller: 'code'
      }
    },
    invite: {
      method: 'PUT',
      params: {
      	controller: 'invite'
      }
    }
  });
}

angular.module('stikerApp.auth')
  .factory('User', UserResource);

})();
