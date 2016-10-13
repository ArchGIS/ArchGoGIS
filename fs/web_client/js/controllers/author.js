'use strict';

App.controllers.author = new (App.View.extend({
  "show": function() {
    App.url.setMapping(["id"]);
    var id = App.url.get("id");
    var data = {};
    data['orgs'] = {};
    data['researches'] = {};

    var d1 = $.Deferred();
    var d2 = $.Deferred();

    var query = JSON.stringify({
      "author:Author": {"id": id, "select": "*"},
      "researches:Research": {"id": "*", "select": "*"},
      "knowledges:Knowledge": {"id": "*", "select": "*"},
      "researches_hasauthor_author": {},
      "researches_has_knowledges": {},
    });

    var query_get_orgs = JSON.stringify({
      "author:Author": {"id": id, "select": "*"},
      "jobs:AuthorJob": {"id": "*", "select": "*"},
      "orgs:Organization": {"id": "*", "select": "*"},
      "author_has_jobs": {},
      "jobs_belongsto_orgs": {},
    });

    $.post("/hquery/read", query_get_orgs).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d1.resolve()
    });

    $.post("/hquery/read", query).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d2.resolve()
    });

    console.log(data);
    $.when(d1, d2).done(function() {App.page.render("author/show", data)});
  }
}));
