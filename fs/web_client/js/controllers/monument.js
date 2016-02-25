'use strict';

App.controllers.monument = new (App.View.extend({
  'new': function() {
	App.template.get('monument', function(tmpl) {
      App.$body.html(tmpl({'param': 'test data'}));
	});
  },

  'destruct': function() {
	console.log('monument controller is done');
  }
}));