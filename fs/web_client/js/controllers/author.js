'use strict';

App.controllers.author = new (App.View.extend({
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
          "researches_hasauthor_author": {},
        }),
        publications: JSON.stringify({
          "author:Author": {"id": aid},
          "pubs:Publication": {"id": "*", "select": "*"},
          "pubs_hasauthor_author": {},
        }),
        copublications: JSON.stringify({
          "author:Author": {"id": aid},
          "copubs:Publication": {"id": "*", "select": "*"},
          "copubs_hascoauthor_author": {},
        })
      },

      single: {
        author: JSON.stringify({
          "author:Author": {"id": aid, "select": "*"},
        }),
        photos: JSON.stringify({
          "author:Author": {"id": aid},
          "photos:Image": {"id": "*", "select": "*"},
          "author_has_photos": {}
        }),
        orgs: JSON.stringify({
          "author:Author": {"id": aid},
          "jobs:AuthorJob": {"id": "*", "select": "*"},
          "orgs:Organization": {"id": "*", "select": "*"},
          "author_has_jobs": {},
          "jobs_belongsto_orgs": {},
        })
      },

      publication: {
        publicationTypes: JSON.stringify({
          "pub:Publication": {"id": "NEED"},
          "pubtype:PublicationType": {"id": "*", "select": "*"},
          "pub_has_pubtype": {},
        }),
      },

      copublication: {
        copublicationTypes: JSON.stringify({
          "copub:Publication": {"id": "NEED"},
          "copubtype:PublicationType": {"id": "*", "select": "*"},
          "copub_has_copubtype": {},
        })
      },

      research: {
        monuments: JSON.stringify({
          "researches:Research": {"id": "NEED"},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "m:Monument": {"id": "*"},
          "monType:MonumentType": {"id": "*", "select": "*"},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "researches_has_knowledges": {},
          "knowledges_belongsto_m": {},
          "m_has_monType": {},
          "m_has_epoch": {}
        }),
        resTypes: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "researches_has_resType": {},
        })
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })

      tmplData.placemarks = [];
      _.each(tmplData.monuments, function(resMonuments, resId) {
        _.each(resMonuments.knowledges, function(know, kid) {
          var type = resMonuments.monType[kid].id || 10;
          var epoch = resMonuments.epoch[kid].id || 0;
          console.log(`monType${type}_${epoch}`);
          tmplData.placemarks.push({
            coords: [know.x, know.y],
            pref: {
              hintContent: know.monument_name
            },
            opts: {
              preset: `monType${type}_${epoch}`
            }
          })
        })
      })
      
      console.log(tmplData);
      App.page.render("author/show", tmplData);
    }

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    $.when(model.sendQuery(queries.complex.researches)).then(function(response) {
      _.extend(tmplData, response);

      var researchIds = _.map(tmplData.researches, function(res) {return res.id.toString()});

      data.push(model.getData(queries.research, callRender, true, researchIds));
      callRender();
    })

    $.when(model.sendQuery(queries.complex.publications)).then(function(response) {
      _.extend(tmplData, response);

      var pubsIds = _.map(tmplData.pubs, function(pub) {return pub.id.toString()});

      data.push(model.getData(queries.publication, callRender, true, pubsIds));
      callRender();
    })

    $.when(model.sendQuery(queries.complex.copublications)).then(function(response) {
      _.extend(tmplData, response);

      var copubsIds = _.map(tmplData.copubs, function(copub) {return copub.id.toString()});

      data.push(model.getData(queries.copublication, callRender, true, copubsIds));
      callRender();
    })

    data.push(model.getData(queries.single, callRender));
  }
}));
