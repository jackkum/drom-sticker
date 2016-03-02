'use strict';

angular.module('stikerApp')
	.directive('deleteItem', function(Item, Modal, $filter) {
		return {
      restrict: 'A',
      scope: {
      	item: '='
      },
      link: function(scope, element) {
        element.click(function(){
        	if( ! (scope.item instanceof Item)){
      			scope.item = new Item(scope.item);
    			}

    			Modal.confirm(
						'Подтвердить удаление', 
						'<p>Удалить выстрел от <strong>' + $filter('date')(scope.item.dtime, 'd MMMM HH:mm') + '</strong> ?</p>'
					).result.then(() => {
						scope.item.$remove();
					});
        });
      }
    };
	})
	.directive('openImage', function(Modal){
		return {
      restrict: 'A',
      scope: {
      	item: '='
      },
      link: function(scope, element) {
        element.click(function(){
    			Modal.confirm('Мина', '<img src="/api/items/image/' + scope.item._id + '" class="item-preview"/>', 'success', 'lg');
        });
      }
    };
	})
	.directive('confirmItem', function(Item, Modal, $filter) {
		return {
      restrict: 'A',
      scope: {
      	item: '='
      },
      link: function(scope, element) {
        element.click(function(){
        	if( ! (scope.item instanceof Item)){
      			scope.item = new Item(scope.item);
    			}

    			Modal.confirm(
			  		'Подтвердить выстрел', 
			  		'<p>Подтвердить выстрел?</p>',
			  		'success'
			  	).result.then(() => {
			  		scope.item.victim.confirm = true;
						scope.item.$save();
			  	});
        });
      }
    };
	})
	.directive('cancelItem', function(Item, Modal) {
		return {
      restrict: 'A',
      scope: {
      	item: '='
      },
      link: function(scope, element) {
        element.click(function(){
        	
    			var item = null;
					if( ! (scope.item instanceof Item)){
			      item = new Item(scope.item);
			    } else {
			    	item = angular.copy(scope.item);
			    }

			    item.victim.cancel = true;

			    var modal = Modal.open({
			  		modal: {dismissable: true},
			  		item: item,
			  		submit: (form) => {
			        if(form.$valid){
			          item.$save();
			          modal.close();
			        }
			  		}
			  	}, 'modal-default', 'components/forms/cancel.form.html');
        });
      }
    };
	});