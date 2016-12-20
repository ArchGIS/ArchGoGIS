'use strict';

App.controllers.publication = new (Backbone.View.extend({
  "show": function() {
  	App.url.setMapping(["id"]);
    var pid = App.url.get("id");
    var data = [];
    var tmplData = {};
    var model = App.models.fn;

    var queries = {
      single: {
        publication: JSON.stringify({
          "pub:Publication": {"id": pid, "select": "*"},
        }),
        pubType: JSON.stringify({
          "pub:Publication": {"id": pid},
          "pubtype:PublicationType": {"id": "*", "select": "*"},
          "pub__has__pubtype": {},
        }),
        city: JSON.stringify({
          "pub:Publication": {"id": pid},
          "city:City": {"id": "*", "select": "*"},
          "pub__has__city": {},
        }),
        researches: JSON.stringify({
          "pub:Publication": {"id": pid},
          "researches:Research": {"id": "*", "select": "*"},
          "researches__has__pub": {},
        }),
        publisher: JSON.stringify({
          "pub:Publication": {"id": pid},
          "publisher:Publisher" :  {"id": "*", "select": "*"},
          "publisher__has__pub": {},
        }),
        authors: JSON.stringify({
          "pub:Publication": {"id": pid},
          "author:Author": {"id": "*", "select": "*"},
          "pub__hasauthor__author": {},
        }),
        coauthors: JSON.stringify({
          "pub:Publication": {"id": pid},
          "coauthors:Author": {"id": "*", "select": "*"},
          "pub__hascoauthor__coauthors": {},
        })
      }
    }

     var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      console.log(tmplData);

      App.page.render("publication/show", tmplData);
    }

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    data.push(model.getData(queries.single, callRender));
  }
}));