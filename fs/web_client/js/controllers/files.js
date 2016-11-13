'use strict';

App.controllers.files = new (Backbone.View.extend({
  'show': function() {
    console.log("Files contoller");
    App.page.render('wizard/save_file');
  }
}));