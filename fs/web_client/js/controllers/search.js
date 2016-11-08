'use strict';

App.controllers.search = new (App.View.extend({
  'start': function() { console.log('search start'); },
  
  'index': function() {
    App.page.render('search');
  }
}));
