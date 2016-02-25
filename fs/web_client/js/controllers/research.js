'use strict';

App.controllers.research = new (App.View.extend({
  'new': function() {
    App.page.render('research');
  },

  'destruct': function() {
    console.log('research controller is done');
  }
}));
