'use strict';

App.controllers.organization = new (Backbone.View.extend({
  'show': function() {
    App.page.render('organization/show');
  }
}));
