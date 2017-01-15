'use strict';

App.controllers.admin = new (Backbone.View.extend({
  'main': function() {
    App.page.render('admin/main');
	}
}))