'use strict';

App.controllers.collection = new (Backbone.View.extend({
	'show': function() {
    App.url.setMapping(['id']);
    var cid = App.url.get('id');
    var data = [];
    var tmplData = {};
    var model = App.models.fn;

    var queries = {
      single: {
      	collection: JSON.stringify({
          "collection:Collection": {"id": cid, "select": "*"}
        }),

        storage: JSON.stringify({
        	"coll:Collection": {"id": cid},
        	"org:Organization": {"id": "*", "select": "*"},
        	"city:City": {"id": "*", "select": "*"},
        	"coll__in__org": {},
        	"org__has__city": {}
        }),

        artifacts: JSON.stringify({
        	"coll:Collection": {"id": cid},
        	"inters:StorageInterval": {"id": "*", "select": "*"},
        	"artifacts:Artifact": {"id": "*", "select": "*"},
        	"knows:Knowledge": {"id": "*", "select": "*"},
        	"monuments:Monument": {"id": "*", "select": "*"},
        	"coll__has__inters": {},
        	"artifacts__has__inters": {},
        	"knows__found__artifacts": {},
        	"knows__belongsto__monuments": {}
        })
      },
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      console.log(tmplData);

      App.page.render("collection/show", tmplData);
    }

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    data.push(model.getData(queries.single, callRender));

  }
}))