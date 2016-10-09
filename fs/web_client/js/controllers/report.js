'use strict';

App.controllers.report = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get("id");

    var query = {
      "r:Report": {"id": id, "select": "*"},
      "a:Author": {"id": "*", "select": "*"},
      "k:Knowledge": {"id": "*", "select": "*"},
      "m:Monument": {"id": "*", "select": "*"},
      "a_Created_r": {},
      "r_Contains_k": {},
      "k_Describes_m": {}
    };

    $.post('/hquery/read', JSON.stringify(query))
      .success(function(reportData) {
        App.page.render('report/show', JSON.parse(reportData));
      });
  }
}));