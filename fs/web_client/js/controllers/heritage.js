'use strict';

App.controllers.heritage = new (Backbone.View.extend({
  'new': function() {
  	App.page.render('heritage/new', {})
  },
}));