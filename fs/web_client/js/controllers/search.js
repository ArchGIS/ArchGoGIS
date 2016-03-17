'use strict';

App.controllers.search = new (App.View.extend({
  'index': function() {
    App.page.render('search');
  }
}));
