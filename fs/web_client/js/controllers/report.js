'use strict';

App.controllers.report = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get("id");

    var query = {
      "rep:Report": {"id": id, "select": "*"},
      "a:Author": {"id": "*", "select": "*"},
      "res:Research": {"id": "*", "select": "*"},
      "k:Knowledge": {"id": "*", "select": "*"},
      "m:Monument": {"id": "*", "select": "*"},
      "res_hasauthor_a": {},
      "res_has_k": {},
      "rep_hasauthor_a": {},
      "k_has_rep": {},
      "k_belongsto_m": {}
    };

    $.post('/hquery/read', JSON.stringify(query))
      .success(function(reportData) {
        console.log(JSON.parse(reportData));
        App.page.render('report/show', JSON.parse(reportData));
      });
  }
}));