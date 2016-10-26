'use strict';

App.controllers.publication = new (App.View.extend({
  "show": function() {
  	App.url.setMapping(["id"]);
    var pid = App.url.get("id");
    var tmplData = {
      "publisher": [],
      "pubtype": [],
      "author": [],
      "coauthors": [],
    };

    var d1 = $.Deferred(),
        d2 = $.Deferred(),
        d3 = $.Deferred(),
        d4 = $.Deferred(),
        d5 = $.Deferred();

    var query_publication = JSON.stringify({
      "pub:Publication": {"id": pid, "select": "*"},
    });

    var query_pub_type = JSON.stringify({
      "pub:Publication": {"id": pid},
      "pubtype:PublicationType": {"id": "*", "select": "*"},
      "pub_has_pubtype": {},
    });

    var query_publisher = JSON.stringify({
      "pub:Publication": {"id": pid},
      "publisher:Publisher" :  {"id": "*", "select": "*"},
      "publisher_has_pub": {},
    });

    var query_authors = JSON.stringify({
      "pub:Publication": {"id": pid},
			"author:Author": {"id": "*", "select": "*"},
      "pub_hasauthor_author": {},
    });

    var query_coauthors = JSON.stringify({
      "pub:Publication": {"id": pid},
			"coauthors:Author": {"id": "*", "select": "*"},
      "pub_hascoauthor_coauthors": {},
    });

		$.when(App.models.fn.sendQueryWithDeferred(query_publication, d1)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_pub_type, d2)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_publisher, d3)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_authors, d4)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_coauthors, d5)).then(function(response) {
      _.extend(tmplData, response);
    })

		console.log(tmplData);
    $.when(d1, d2, d3, d4, d5).done(function() {
      App.page.render("publication/show", tmplData);
    });
  }
}));