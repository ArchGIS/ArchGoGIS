'use strict';

App.controllers.author = new (Backbone.View.extend({
  "show": function() {
    App.url.setMapping(["id"]);
    var aid = App.url.get("id");
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      complex: {
        researches: JSON.stringify({
          "author:Author": {"id": aid},
          "researches:Research": {"id": "*", "select": "*"},
          "researches__hasauthor__author": {},
        }),
        monuments: JSON.stringify({
          "author:Author": {"id": aid},
          "researches:Research": {"id": "*"},
          "k:Knowledge": {"id": "*"},
          "monuments:Monument": {"id": "*", "select": "*", "options":"uniq"},
          "researches__has__k": {},
          "k__belongsto__monuments": {},
        }),
        publications: JSON.stringify({
          "author:Author": {"id": aid},
          "pubs:Publication": {"id": "*", "select": "*"},
          "pubs__hasauthor__author": {},
        }),
        copublications: JSON.stringify({
          "author:Author": {"id": aid},
          "copubs:Publication": {"id": "*", "select": "*"},
          "copubs__hascoauthor__author": {},
        })
      },

      single: {
        author: JSON.stringify({
          "author:Author": {"id": aid, "select": "*"},
        }),
        photos: JSON.stringify({
          "author:Author": {"id": aid},
          "photos:Image": {"id": "*", "select": "*"},
          "author__has__photos": {}
        }),
        reports: JSON.stringify({
          "author:Author": {"id": aid},
          "reports:Report": {"id": "*", "select": "*"},
          "reports__hasauthor__author": {}
        }),
        orgs: JSON.stringify({
          "author:Author": {"id": aid},
          "jobs:AuthorJob": {"id": "*", "select": "*"},
          "orgs:Organization": {"id": "*", "select": "*"},
          "author__has__jobs": {},
          "jobs__belongsto__orgs": {},
        })
      },

      publications: {
        publicationTypes: JSON.stringify({
          "pub:Publication": {"id": "NEED"},
          "pubtype:PublicationType": {"id": "*", "select": "*"},
          "pub__has__pubtype": {},
        }),
      },

      copublications: {
        copublicationTypes: JSON.stringify({
          "copub:Publication": {"id": "NEED"},
          "copubtype:PublicationType": {"id": "*", "select": "*"},
          "copub__has__copubtype": {},
        })
      },

      researches: {         
        resTypes: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "researches__has__resType": {},
        }),

        excavations: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "excavations:Excavation": {"id": "*", "select": "*"},
          "excSpatref:SpatialReference": {"id": "*", "select": "*"},
          "excSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "researches__has__excavations": {},
          "excavations__has__excSpatref": {},
          "excSpatref__has__excSpatrefT": {},
        }),

        resMonuments: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "knowledges:Knowledge": {"id": "*"},
          "resMonuments:Monument": {"id": "*", "select": "*"},
          "knowledges__belongsto__resMonuments": {},
          "researches__has__knowledges": {},
        })
      },

      monuments: {
        knowledges: JSON.stringify({
          "a:Author": {"id": "*"},
          "r:Research": {"id": "*"},
          "m:Monument": {"id": "NEED"},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "knowledges__belongsto__m": {},
          "r__has__knowledges": {},
          "r__hasauthor__a": {}
        }),

        epochs: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "epochs:Epoch": {"id": "*", "select": "*"},
          "m__has__epochs": {}
        }),

        monTypes: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "monTypes:MonumentType": {"id": "*", "select": "*"},
          "m__has__monTypes": {}
        }),

        monSpatref: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "monSpatref:SpatialReference": {"id": "*", "select": "*"},
          "monSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__has__monSpatref": {},
          "monSpatref__has__monSpatrefT": {}
        }),
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })

      tmplData.placemarks = [];

      let monPlacemarks = App.controllers.fn.getMonPlacemarks(tmplData);
      let resPlacemarks = App.controllers.fn.getResPlacemarks(tmplData);

      tmplData.placemarks = _.union(tmplData.placemarks, monPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, resPlacemarks);

      console.log(tmplData);
      App.page.render("author/show", tmplData, tmplData.placemarks);
    }

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    _.each(queries.complex, function(query, key) {
      $.when(model.sendQuery(query)).then(function(response) {
        _.extend(tmplData, response);

        var ids = _.map(tmplData[key], function(obj) {return obj.id.toString()});

        data.push(model.getData(queries[key], callRender, true, ids));
        callRender();
      })
    })

    data.push(model.getData(queries.single, callRender));
  }
}));
