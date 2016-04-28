'use strict';

App.controllers.monument = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get('id');

    var query = JSON.stringify({
      "monument:Monument.getBy": +id,
      "epoch:Epoch.getBy": "monument",
      "type:MonumentType.getBy": "monument",
      "objects:Object.getBy": "monument",
      "knowledges:Knowledge.getBy": "monument",
      "researches:Research.getBy": "knowledges",
      "cultures:Culture.getBy": "knowledges",
      "authors:Author.getBy": "researches"
    });

    $.post("/hquery/read2", query).success(function(response) {
      App.page.render("monument_view", response);
    });
  },

  'new': function() {
    App.page.on("atClear", function() {
      console.log('monument controller is done (destructor)');
    });
    
    App.page.render('monument', {
      'authorsInputOptions': {
        'source': App.models.Author.findByNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        }
      }
    });
  },

  "new_by_arch_map": function() {
    var models = {
      "knowledge": new App.models.Knowledge(),
      "monument": new App.models.Monument(),
      // "research": new App.models.Research(),
      // "collection": new App.models.Collection(),
      // "archMap": new App.models.ArchMap()
    };
    var form = new App.Form(models);
    window.form = form;
       
    App.page.render("monument/new_by_arch_map", {"form": form}, models);
  },

  'start': function() {
    console.log('monument controller is launched');
  }
}));
