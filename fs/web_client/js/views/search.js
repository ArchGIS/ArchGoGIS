'use strict';

App.views.search = new (App.View.extend({
  'index': function() {
    function makeRequest($dataDiv) {
      _.each($dataDiv.find('input'), function(input) {
	
      });
    }
    
    var $submit = $('#search-submit');
    $submit.on('click', function() {
      $submit.prop('disabled', true);

      var $params = $('#search-criteria').find('input:visible');
      console.log($params);
    });
  }
}));
