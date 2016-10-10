'use strict';

App.controllers.author = new (App.View.extend({
  "show": function() {
    App.url.setMapping(["id"]);
    var id = App.url.get("id");

    // var query = JSON.stringify({
    //   "author:Author.getBy": +id,
    //   "orgs:Organization.mergeBy": "author",
    //   "researches:Research.getBy": "author"
    // });

    var query = JSON.stringify({
      "author:Author": {"id": id, "select": "*"},
      "researches:Research": {"id": "*", "select": "*"},
      "researches_hasauthor_author": {}
    });

    $.post("/hquery/read", query).success(function(response) {
      console.log(response);
      response = JSON.parse(response);
      response['orgs'] = {};
      App.page.render("author/show", response);
    });
  }
}));
