'use strict';

App.controllers.heritage = new (App.View.extend({
  'new': function() {
  	App.page.render('heritage/new', {})
  },
}));