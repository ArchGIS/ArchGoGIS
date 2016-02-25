'use strict';

App.controllers.research = new (App.View.extend({
  'new': function() {
	App.template.get('research', function(tmpl) {
      App.$body.html(tmpl({}));
	});
  },

  'destruct': function() {
	console.log('research controller is done');
  }
}));