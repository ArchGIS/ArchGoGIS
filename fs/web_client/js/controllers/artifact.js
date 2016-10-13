'use strict';

App.controllers.artifact = new (App.View.extend({
  'new': function() {
    App.page.render('artifact', {
      'param': 'test data',
      'authorsInputOptions': {
        'source': App.models.Author.findByNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        }
      },
      'coauthorsInputOptions': {
        'source': App.models.Author.findByLastNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        }
      }
    });
  },

  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get('id');
    var data = {};
    var d1 = $.Deferred();
    var d2 = $.Deferred();
    var d3 = $.Deferred();
    var d4 = $.Deferred();
    var d5 = $.Deferred();

    data.categories = {};
    data.materials = {};
    data.researches = {};
    data.intervals = {};
    data.placemarks = [];

    var queryResearches = JSON.stringify({
      "artifact:Artifact": {"id": id, "select": "*"},
      "researches:Research": {"id": "*", "select": "*"},
      "knowledges:Knowledge":  {"id": "*", "select": "*"},
      "authors:Author": {"id": "*", "select": "*"},
      "knowledges_has_artifact": {},
      "researches_has_knowledges": {},
      "researches_hasauthor_authors": {},
    });

    var queryFound = JSON.stringify({
      "artifact:Artifact": {"id": id, "select": "*"},
      "knowFound:Knowledge": {"id": "*", "select": "*"},
      "monFound:Monument": {"id": "*", "select": "*"},
      "resFound:Research": {"id": "*", "select": "*"},
      "authorFound:Author": {"id": "*", "select": "*"},
      "knowFound_founded_artifact": {},
      "knowFound_belongsto_monFound": {},
      "resFound_has_knowFound": {},
      "resFound_hasauthor_authorFound": {},
    });

    var query_cat = JSON.stringify({
      "artifact:Artifact": {"id": id, "select": "*"},
      "categories:ArtifactCategory": {"id": "*", "select": "*"},
      "artifact_has_categories": {},
    });

    var query_mat = JSON.stringify({
      "artifact:Artifact": {"id": id, "select": "*"},
      "materials:ArtifactMaterial": {"id": "*", "select": "*"},
      "artifact_has_materials": {},
    });

    var query_storage = JSON.stringify({
      "artifact:Artifact": {"id": id, "select": "*"},
      "intervals:StorageInterval": {"id": "*", "select": "*"},
      "storages:Storage": {"id": "*", "select": "*"},
      "city:City": {"id": "*", "select": "*"},
      "artifact_has_intervals": {},
      "storages_has_intervals": {},
      "storages_has_city": {},
    });

    $.post('/hquery/read', queryFound).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      
      data.placemarks.push({
        "coords": [data.knowFound[0].x, data.knowFound[0].y],
        "pref": {
          "hintContent": data.knowFound[0].monument_name
        }
      })

      d1.resolve();
    })

    $.post('/hquery/read', queryResearches).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d5.resolve();
    })

    $.post('/hquery/read', query_cat).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d2.resolve();
    })

    $.post('/hquery/read', query_mat).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d3.resolve();
    })

    $.post('/hquery/read', query_storage).success(function(response) {
      response = JSON.parse(response);
      data = $.extend(data, response);
      d4.resolve();
    })

    console.log(data);
    $.when(d1, d2, d3, d4, d5).done(function() {App.page.render("artifact/show", data)});
  },

  'start': function() {
    console.log('artifact controller is launched');
  }
}));
