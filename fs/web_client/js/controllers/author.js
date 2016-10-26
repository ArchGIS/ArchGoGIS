'use strict';

App.controllers.author = new (App.View.extend({
  "show": function() {
    App.url.setMapping(["id"]);
    var aid = App.url.get("id");
    var tmplData = {
      "orgs": [],
      "researches": [],
      "placemarks": [],
      "pubs": [],
      "copubs": [],
      "photos": [],
      "resType": [],
      "jobs": []
    };

    var d1 = $.Deferred(),
        d2 = $.Deferred(),
        d3 = $.Deferred(),
        d4 = $.Deferred(),
        d5 = $.Deferred(),
        d6 = $.Deferred(),
        d7 = $.Deferred();

    var query_author = JSON.stringify({
      "author:Author": {"id": aid, "select": "*"},
    });

    var query_researches = JSON.stringify({
      "author:Author": {"id": aid},
      "researches:Research": {"id": "*", "select": "*"},
      "researches_hasauthor_author": {},
    });

    var query_photos = JSON.stringify({
      "author:Author": {"id": aid},
      "photos:Image": {"id": "*", "select": "*"},
      "author_has_photos": {}
    });

    var query_orgs = JSON.stringify({
      "author:Author": {"id": aid},
      "jobs:AuthorJob": {"id": "*", "select": "*"},
      "orgs:Organization": {"id": "*", "select": "*"},
      "author_has_jobs": {},
      "jobs_belongsto_orgs": {},
    });

    var query_publications = JSON.stringify({
      "author:Author": {"id": aid},
      "pubs:Publication": {"id": "*", "select": "*"},
      "pubs_hasauthor_author": {},
    });

    var query_publication_types = JSON.stringify({
      "pub:Publication": {"id": "NEED"},
      "pubtype:PublicationType": {"id": "*", "select": "*"},
      "pub_has_pubtype": {},
    }); 

    var query_copublications = JSON.stringify({
      "author:Author": {"id": aid},
      "copubs:Publication": {"id": "*", "select": "*"},
      "copubs_hascoauthor_author": {},
    });

    var query_copublication_types = JSON.stringify({
      "copub:Publication": {"id": "NEED"},
      "copubtype:PublicationType": {"id": "*", "select": "*"},
      "copub_has_copubtype": {},
    }); 

    var query_knowledges = JSON.stringify({
      "researches:Research": {"id": "NEED"},
      "knowledges:Knowledge": {"id": "*", "select": "*"},
      "researches_has_knowledges": {}
    });

    var query_res_types = JSON.stringify({
      "researches:Research": {"id":"NEED"},
      "resType:ResearchType": {"id": "*", "select": "*"},
      "researches_has_resType": {},
    });

    $.when(App.models.fn.sendQueryWithPromise(query_publications)).then(function(response) {
      _.extend(tmplData, response);

      var pubsIds = _.map(tmplData.pubs, function(pub) {return pub.id.toString()});

      $.when(App.models.fn.sendQueriesWithDeferred(query_publication_types, pubsIds, d1)).then(function(response) {
        tmplData.pubTypes = response;
      });
    })

    $.when(App.models.fn.sendQueryWithPromise(query_copublications)).then(function(response) {
      _.extend(tmplData, response);

      var copubsIds = _.map(tmplData.copubs, function(copub) {return copub.id.toString()});

      $.when(App.models.fn.sendQueriesWithDeferred(query_copublication_types, copubsIds, d2)).then(function(response) {
        tmplData.coPubTypes = response;
      });
    })

    $.when(App.models.fn.sendQueryWithPromise(query_researches)).then(function(response) {
      _.extend(tmplData, response);

      var researchIds = _.map(tmplData.researches, function(res) {return res.id.toString()});

      $.when(App.models.fn.sendQueriesWithDeferred(query_knowledges, researchIds, d3)).then(function(response) {
        tmplData.knowledges = response;
      });
      $.when(App.models.fn.sendQueriesWithDeferred(query_res_types, researchIds, d4)).then(function(response) {
        tmplData.resTypes = response;
      });
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_author, d5)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_photos, d6)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_orgs, d7)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(d1, d2, d3, d4, d5, d6, d7).done(function() {
      _.each(tmplData.knowledges, function(resKnows, resId) {
        _.each(resKnows, function(know, kid) {
          tmplData.placemarks.push({
            "coords": [know.x, know.y],
            "pref": {
              "hintContent": know.name,
              "iconContent": `${resId+1}-${kid+1}`
            }
          })
        })
      })
      
      console.log(tmplData);
      App.page.render("author/show", tmplData);
    });
  }
}));
