'use strict';

App.controllers.main = new (Backbone.View.extend({
  'index': () => {
    let query = {
      'counts': []
    };

    $.post('/hquery/read', JSON.stringify(query))
      .success(function(reportData) {
        App.page.render('mainpage', JSON.parse(reportData));
      });
  }
}));