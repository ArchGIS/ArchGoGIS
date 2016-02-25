'use strict';

App.controllers.monument = new (App.View.extend({
  'new': function() {
    App.page.render('monument', {'param': 'test data'});
  },

  'start': function() {
    console.log('monument controller is launched');
  },

  'finish': function() {
    console.log('monument controller is done');
  }
}));
