'use strict';

App.controllers.author = new (App.View.extend({
  "show": function() {
    App.url.setMapping(["id"]);
    var id = App.url.get("id");
    var data = {};
    data['orgs'] = {};
    data['researches'] = {};
    data['placemarks'] = [];
    data['pubs'] = {};
    data['pubsco'] = {};

    var d1 = $.Deferred();
    var d2 = $.Deferred();
    var d3 = $.Deferred();

    var query = JSON.stringify({
      "author:Author": {"id": id, "select": "*"},
      "photo:Image": {"id": "*", "select": "*"},
      "researches:Research": {"id": "*", "select": "*"},
      "knowledges:Knowledge": {"id": "*", "select": "*"},
      "researches_hasauthor_author": {},
      "researches_has_knowledges": {},
      "author_has_photo": {}
    });

    var query_get_orgs = JSON.stringify({
      "author:Author": {"id": id, "select": "*"},
      "jobs:AuthorJob": {"id": "*", "select": "*"},
      "orgs:Organization": {"id": "*", "select": "*"},
      "author_has_jobs": {},
      "jobs_belongsto_orgs": {},
    });

    var query_get_publications = JSON.stringify({
      "author:Author": {"id": id, "select": "*"},
      "pubs:Publication": {"id": "*", "select": "*"},
      "pubtype:PublicationType": {"id": "*", "select": "*"},
      "pubsco:Publication": {"id": "*", "select": "*"},
      "pubcotype:PublicationType": {"id": "*", "select": "*"},
      "pubs_has_pubtype": {},
      "pubs_hasauthor_author": {},
      "pubsco_hascoauthor_author": {},
      "pubsco_has_pubcotype": {},
    });

    $.post("/hquery/read", query_get_orgs).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d1.resolve()
    });

    $.post("/hquery/read", query).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);

      $.each(data.knowledges, function(id, know) {
        data.placemarks.push({
          "coords": [know.x, know.y],
          "pref": {
            "hintContent": know.monument_name,
            "iconContent": id+1,
          }
        })
      })

      d2.resolve()
    });

    $.post("/hquery/read", query_get_publications).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d3.resolve()
    });

    console.log(data);
    $.when(d1, d2, d3).done(function() {App.page.render("author/show", data)});
  }
}));
