'use strict';

(function() {

/**
 * The Util service is for thin, globally reusable, utility functions
 */
function ResourceService($resource) {
  var Resource = {
    get: function(route, paramDefault, actionsDefault)
    {
      var params = angular.extend({}, {
          id: '@_id'
        }, paramDefault),
          actions = angular.extend({}, {
            show: {
              method: 'GET'
            },
            create: {
              method: 'POST'
            },
            update: {
              method: 'PUT'
            },
            destroy: {
              method: 'DEL'
            }
          }, actionsDefault);
        
      var resource = $resource(route, params, actions);
  
      resource.prototype.$save = function()
      {
        var args = Array.prototype.slice.call(arguments);
        if (this._id) {
          return this.$update.apply(this, args);
        } else {
          return this.$create.apply(this, args);
        }
      };
      
      return resource;
    }
  };

  return Resource;
}

angular.module('stikerApp.resource')
  .factory('Resource', ResourceService);

})();
