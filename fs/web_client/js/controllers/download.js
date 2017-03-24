'use strict';

App.controllers.download = new (Backbone.View.extend({
  'index': function() {
    App.page.render('download/index');
  }
}))