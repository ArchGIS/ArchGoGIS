'use strict';

App.controllers.wizard = new (Backbone.View.extend({
  'create_data': function() {
    App.page.render('wizard/create_data');
  },

  'future1': function() {
    App.page.render('wizard/future1');
  },

  'future2': function() {
    App.page.render('wizard/future2');
  },

  'future3': function() {
    App.page.render('wizard/future3');
  },

  'future4': function() {
    App.page.render('wizard/future4');
  },

  'future5': function() {
    App.page.render('wizard/future5');
  },

  'team': function() {
    App.page.render('team');
  },
}));
