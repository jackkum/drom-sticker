'use strict';

angular.module('stikerApp')
  .factory('Modal', function($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope = {}, modalClass = 'modal-default', templateUrl = 'components/modal/modal.html', size = undefined) {
      var modalScope = $rootScope.$new();

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: templateUrl,
        windowClass: modalClass,
        scope: modalScope,
        size: size
      });
    }

    // Public API here
    return {

      open: (scope, type, templateUrl, size) => {
        return openModal(scope, type, templateUrl, size);
      },

      /* Confirmation modals */
      confirm: (title, message, type = 'danger', size = undefined, callback = angular.noop) => {

        var confirmModal = openModal({
          modal: {
            dismissable: true,
            title: title, //'Confirm Delete',
            html: message, //'<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
            buttons: [{
              classes: 'btn-' + type,
              text: 'Ok',
              click: function(e) {
                confirmModal.close(e);
              }
            }, {
              classes: 'btn-default',
              text: 'Отмена',
              click: function(e) {
                confirmModal.dismiss(e);
              }
            }]
          }
        }, 'modal-' + type, 'components/modal/confirm.html', size);

        confirmModal.result.then(function(event) {
          callback.apply(event);
        });

        return confirmModal;
      }
    };
  });
