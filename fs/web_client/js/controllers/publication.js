'use strict';

App.controllers.publication = new (App.View.extend({
  "show": function() {
  	App.url.setMapping(["id"]);
    var id = App.url.get("id");
    var data = {};
    data['coauthors'] = {};

    var d1 = $.Deferred();
    var d2 = $.Deferred();

    var query_authors = JSON.stringify({
      "pub:Publication": {"id": id, "select": "*"},
      "publisher:Publisher" :  {"id": "*", "select": "*"},
			"author:Author": {"id": "*", "select": "*"},
      "pubtype:PublicationType": {"id": "*", "select": "*"},
      "publisher_has_pub": {},
      "pub_has_pubtype": {},
      "pub_hasauthor_author": {},
    });

    var query_coauthors = JSON.stringify({
      "pub:Publication": {"id": id, "select": "*"},
			"coauthors:Author": {"id": "*", "select": "*"},
      "pubtype:PublicationType": {"id": "*", "select": "*"},
      "pub_has_pubtype": {},
      "pub_hascoauthor_coauthors": {},
    });

		$.post("/hquery/read", query_authors).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d1.resolve()
    });

    $.post("/hquery/read", query_coauthors).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d2.resolve()
    });

		console.log(data);
    $.when(d1, d2).done(function() {App.page.render("publication/show", data)});
  }
}));