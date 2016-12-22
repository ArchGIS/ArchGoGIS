'use strict';

App.controllers.bigSearch = new (Backbone.View.extend({
  'start': function() { console.log('search start'); },
  
  'index': function() {
    App.page.render('bigSearch/index');
  }
}));
