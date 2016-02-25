'use strict';

App.controllers.research = new (App.View.extend({
  'new': function() {
    App.page.render('research');
  },

  'finish': function() {
    console.log('research controller is done');
  }
}));
