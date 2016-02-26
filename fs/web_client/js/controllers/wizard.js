'use strict';

App.controllers.wizard = new (App.View.extend({
  'create': function() {
    App.page.render('create_data');
  }
}));
