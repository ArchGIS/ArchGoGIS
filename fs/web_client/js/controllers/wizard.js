'use strict';

App.controllers.wizard = new (App.View.extend({
  'create_data': function() {
    App.page.render('wizard/create_data');
  }
}));
