'use strict';

App.controllers.organization = new (App.View.extend({
  'show': function() {
    App.page.render('organization/show');
  }
}));
