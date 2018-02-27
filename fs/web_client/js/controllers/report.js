'use strict';

App.controllers.report = new (Backbone.View.extend({
  'show': function() {
    App.url.setMapping(["id", "mod"]);
    var rid = App.url.get("id");
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      single: {
        report: JSON.stringify({
          "report:Report": {"id": rid, "select": "*"},
        }),
        researches: JSON.stringify({
          "r:Report": {"id": rid},
          "researches:Research": {"id": "*", "select": "*"},
          "resTypes:ResearchType": {"id": "*", "select": "*"},
          "researches__has__r": {},
          "researches__has__resTypes": {}
        }),
        author: JSON.stringify({
          "r:Report": {"id": rid},
          "author:Author": {"id": "*", "select": "*"},
          "r__hasauthor__author": {}
        }),
        org: JSON.stringify({
          "r:Report": {"id": rid},
          "org:Organization": {"id": "*", "select": "*"},
          "city:City": {"id": "*", "select": "*"},
          "r__in__org": {},
          "org__has__city": {},
        })
      },
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      
      console.log(tmplData);
      App.page.render("report/show", tmplData);
    }

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    data.push(model.getData(queries.single, callRender));
  }
}));