'use strict';

App.controllers.author = new (App.View.extend({
  "show": function() {
    App.url.setMapping(["id"]);
    var id = App.url.get("id");

    var query = JSON.stringify({
      "author:Author.getBy": +id,
      "orgs:Organization.mergeBy": "author",
      "researches:Research.getBy": "author"
    });

    $.post("/hquery/read2", query).success(function(response) {
      console.log(response);
      App.page.render("author/show", response);
    });
  }
}));
