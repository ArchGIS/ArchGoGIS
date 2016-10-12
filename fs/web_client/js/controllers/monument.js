'use strict';

App.controllers.monument = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get('id');

    var query = JSON.stringify({
      "monument:Monument": {"id": id, "select": "*"},
      "researches:Research": {"id": "*", "select": "*"},
      "authors:Author": {"id": "*", "select": "*"},
      "knowledges:Knowledge": {"id": "*", "select": "*"},
      "culture:Culture": {"id": "*", "select": "*"},
      "researches_hasauthor_authors": {},
      "researches_has_knowledges": {},
      "knowledges_belongsto_monument": {},
      "knowledges_has_culture": {}
    });

    $.post("/hquery/read", query).success(function(data) {
      data = JSON.parse(data);
      data.placemarks = [];
      console.log(data);
      $.each(data.knowledges, function(id, knowledge) {
        data.placemarks.push({
          "coords": [knowledge.y, knowledge.x],
          "pref": {"hintContent": knowledge.monument_name}
        })
      });

      App.page.render("monument_view", data);
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

  "new_by_xlsx": function() {
    App.page.render("monument_from_xlsx");
  },

  "new_by_arch_map": function() {
    var m = App.models;
    var models = {
      "archMap": new m.ArchMap(),
      "knowledge": new m.Knowledge(),
      "monument": new m.Monument(),
      "researchRef": new m.ResearchRef(),
      "archMapRecord": new m.ArchMapRecord(),
      "literatureRef": new m.LiteratureRef()
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
