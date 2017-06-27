'use strict';

App.controllers.monument = new (Backbone.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var monId = App.url.get('id');
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      complex: {
        knowledges: JSON.stringify({
          "monuments:Monument": {"id": monId, "select": "*"},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "researches:Research": {"id": "*"},
          "knowledges__belongsto__monuments": {},
          "researches__has__knowledges": {},
        }),

        researches: JSON.stringify({
          "monument:Monument": {"id": monId},
          "researches:Research": {"id": "*", "select": "*"},
          "authors:Author": {"id": "*", "select": "*"},
          "knowledges:Knowledge": {"id": "*"},
          "researches__hasauthor__authors": {},
          "researches__has__knowledges": {},
          "knowledges__belongsto__monument": {},
        }),

        artifacts: JSON.stringify({
          "artiAuthors:Author": {"id": "*", "select": "*"},
          "artiResearches:Research": {"id": "*", "select": "*"},
          "monument:Monument": {"id": monId},
          "knowledges:Knowledge": {"id": "*"},
          "artifacts:Artifact": {"id": "*", "select": "*"},
          "knowledges__belongsto__monument": {},
          "knowledges__found__artifacts": {},
          "artiResearches__has__knowledges": {},
          "artiResearches__hasauthor__artiAuthors": {},
        }),

        carbon: JSON.stringify({
          "mon:Monument": {"id": monId},
          "k:Knowledge": {"id": "*"},
          "carbonMaterial:CarbonMaterial": {"id": "*", "select": "*"},
          "carbon:Radiocarbon": {"id": "*", "select": "*"},
          "carSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "k__belongsto__mon": {},
          "k__has__carbon": {},
          "carbon__has__carSpatref": {},
          "carbon__carbonMaterial": {},
          "carSpatref__has__carSpatrefT": {}
        }),

        otherLayers: JSON.stringify({
          "mon:Monument": {"id": monId},
          "otherLayers:Monument": {"id": "*", "select": "*"},
          "sp:SpatialReference": {"id": "*"},
          "sp__mon": {},
          "sp__otherLayers": {},
        }),

        underMons: JSON.stringify({
          "monument:Monument": {"id": monId},
          "underMons:Monument": {"id": "*", "select": "*"},
          "monument__up__underMons": {},
        }),

        upMons: JSON.stringify({
          "monument:Monument": {"id": monId},
          "upMons:Monument": {"id": "*", "select": "*"},
          "monument__under__upMons": {},
        }),
      },

      single: {
        cultures: JSON.stringify({
          "monument:Monument": {"id": monId},
          "knowledges:Knowledge": {"id": "*"},
          "cultures:Culture": {"id": "*", "select": "*"},
          "knowledges__belongsto__monument": {},
          "knowledges__has__cultures": {},
        }),
        cultKnow: JSON.stringify({
          "monument:Monument": {"id": monId},
          "knowledges:Knowledge": {"id": "*"},
          "cultures:Culture": {"id": "*"},
          "cultRes:Research": {"id": "*", "select": "*"},
          "cultAuthor:Author": {"id": "*", "select": "*"},
          "cultRestype:ResearchType": {"id": "*", "select": "*"},
          "cultKnow:CultureKnowledge": {"id": "*", "select": "*"},
          "cultDatescale:DateScale": {"id": "*", "select": "*"},
          "knowledges__monument": {},
          "knowledges__cultures": {},
          "knowledges__cultRes": {},
          "cultures__cultKnow": {},
          "cultRes__cultKnow": {},
          "cultRes__cultAuthor": {},
          "cultRes__cultRestype": {},
          "cultDatescale__cultKnow": {},
        }),
        epochs: JSON.stringify({
          "monument:Monument": {"id": monId},
          "epochs:Epoch": {"id": "*", "select": "*"},
          "monument__has__epochs": {},
        }),
        monTypes: JSON.stringify({
          "monument:Monument": {"id": monId},
          "monTypes:MonumentType": {"id": "*", "select": "*"},
          "monument__has__monTypes": {},
        }),
        heritage: JSON.stringify({
          "monument:Monument": {"id": monId},
          "heritage:Heritage": {"id": "*", "select": "*"},
          "heritage__has__monument": {}
        }),
        monSpatref: JSON.stringify({
          "monument:Monument": {"id": monId},
          "monSpatref:SpatialReference": {"id": "*", "select": "*"},
          "monSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__has__monSpatref": {},
          "monSpatref__has__monSpatrefT": {}
        }),
      },

      researches: {
        resTypes: JSON.stringify({
          "researches:Research": {"id": "NEED"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "researches__has__resType": {},
        }),
        reports: JSON.stringify({
          "research:Research": {"id": "NEED"},
          "report:Report": {"id": "*", "select": "*"},
          "author:Author": {"id": "*"},
          "research__has__report": {},
          "research__hasauthor__author": {},
          "report__hasauthor__author": {}
        }),
        excavations: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "monument:Monument": {"id": monId},
          "excavations:Excavation": {"id": "*", "select": "*"},
          "monument__has__excavations": {},
          "researches__has__excavations": {},
        }),
        excSpatref: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "monument:Monument": {"id": monId},
          "excavations:Excavation": {"id": "*"},
          "excSpatref:SpatialReference": {"id": "*", "select": "*"},
          "excSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "excavations__has__excSpatref": {},
          "excSpatref__has__excSpatrefT": {},
          "monument__has__excavations": {},
          "researches__has__excavations": {},
        })
      },

      artifacts: {
        artiSpatref: JSON.stringify({
          "artifacts:Artifact": {"id": "NEED"},
          "artiSpatref:SpatialReference": {"id": "*", "select": "*"},
          "artiSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "artifacts__has__artiSpatref": {},
          "artiSpatref__has__artiSpatrefT": {},
        }),

        artiExcSpatref: JSON.stringify({
          "artifacts:Artifact": {"id": "NEED"},
          "excavations:Excavation":  {"id": "*"},
          "artiExcSpatref:SpatialReference": {"id": "*", "select": "*"},
          "artiExcSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "excavations__has__artifacts": {},
          "excavations__has__artiExcSpatref": {},
          "artiExcSpatref__has__artiExcSpatrefT": {},
        }),

        artiMonSpatref: JSON.stringify({
          "artifacts:Artifact": {"id": "NEED"},
          "knowledges:Knowledge":  {"id": "*"},
          "monument:Monument":  {"id": "*"},
          "artiMonSpatref:SpatialReference": {"id": "*", "select": "*"},
          "artiMonSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "knowledges__found__artifacts": {},
          "knowledges__belongsto__monument": {},
          "monument__has__artiMonSpatref": {},
          "artiMonSpatref__has__artiMonSpatrefT": {},
        }),
      },

      knowledges: {
        photos: JSON.stringify({
          "knowledge:Knowledge": {"id": "NEED"},
          "photo:Image": {"id": "*", "select": "*"},
          "cd:CardinalDirection": {"id": "*", "select": "*"},
          "knowledge__has__photo": {},
          "photo__has__cd": {}
        }),
        topos: JSON.stringify({
          "knowledge:Knowledge": {"id": "NEED"},
          "topo:Image": {"id": "*", "select": "*"},
          "knowledge__hastopo__topo": {}
        }),
        monDateScale: JSON.stringify({
          "knowledge:Knowledge": {"id": "NEED"},
          "mds:DateScale": {"id": "*", "select": "*"},
          "knowledge__has__mds": {}
        }) 
      },

      carbon: {
        carbonSpatref: JSON.stringify({
          "carbon:Radiocarbon": {"id": "NEED"},
          "carSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "carbon__has__carSpatref": {},
          "carSpatref__has__carSpatrefT": {}
        }),
        carbonExcSpatref: JSON.stringify({
          "carbon:Radiocarbon": {"id": "NEED"},
          "exc:Excavation": {"id": "*"},
          "carExcSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carExcSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "exc__has__carbon": {},
          "exc__has__carExcSpatref": {},
          "carExcSpatref__has__carExcSpatrefT": {}
        }),
        carbonMonSpatref: JSON.stringify({
          "carbon:Radiocarbon": {"id": "NEED"},
          "know:Knowledge": {"id": "*"},
          "mon:Monument": {"id": "*"},
          "carMonSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carMonSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "know__has__carbon": {},
          "know__belongsto__mon": {},
          "mon__has__carMonSpatref": {},
          "carMonSpatref__has__carMonSpatrefT": {}
        }),
      },

      otherLayers: { 
        otherEpoch: JSON.stringify({
          "layer:Monument": {"id": "NEED"},
          "know:Knowledge": {"id": "*", "select": "*"},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "layer__epoch": {},
          "layer__know": {}
        }),
        otherCulture: JSON.stringify({
          "layer:Monument": {"id": "NEED"},
          "know:Knowledge": {"id": "*"},
          "otherCulture:Culture": {"id": "*", "select": "*"},
          "layer__know": {},
          "know__otherCulture": {}
        }),
      },

      upMons: { 
        upEpoch: JSON.stringify({
          "layer:Monument": {"id": "NEED"},
          "know:Knowledge": {"id": "*", "select": "*"},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "layer__epoch": {},
          "layer__know": {}
        }),
        upCulture: JSON.stringify({
          "layer:Monument": {"id": "NEED"},
          "know:Knowledge": {"id": "*"},
          "upCulture:Culture": {"id": "*", "select": "*"},
          "layer__know": {},
          "know__upCulture": {}
        }),
      },

      underMons: { 
        underEpoch: JSON.stringify({
          "layer:Monument": {"id": "NEED"},
          "know:Knowledge": {"id": "*", "select": "*"},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "layer__epoch": {},
          "layer__know": {}
        }),
        underCulture: JSON.stringify({
          "layer:Monument": {"id": "NEED"},
          "know:Knowledge": {"id": "*"},
          "underCulture:Culture": {"id": "*", "select": "*"},
          "layer__know": {},
          "know__underCulture": {}
        }),
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      console.log(tmplData);

      var names = {};
      _.each(tmplData.knowledges, function(k, id) {
        (names[k.monument_name]) ? names[k.monument_name]++ : names[k.monument_name] = 1;
      })
      tmplData.mainName = _(names).invert()[_(names).max()];
      tmplData.allNames = _.keys(names).join(', ');

      tmplData.placemarks = [];

      let monPlacemarks = App.controllers.fn.getMonPlacemarks(tmplData, true);
      let resPlacemarks = App.controllers.fn.getResPlacemarks(tmplData);
      let excPlacemarks = App.controllers.fn.getExcPlacemarks(tmplData);
      let artPlacemarks = App.controllers.fn.getArtPlacemarks(tmplData);
      let carPlacemarks = App.controllers.fn.getCarPlacemarks(tmplData);

      tmplData.placemarks = _.union(tmplData.placemarks, monPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, resPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, excPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, artPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, carPlacemarks);

      let spatref = _.groupBy(tmplData.monSpatref, function(obj, i) {
        return tmplData.monSpatrefT[i].id;
      })
      tmplData.monSpatrefT = _.groupBy(tmplData.monSpatrefT, function(obj, i) {
        return obj.id;
      })
      _.each(spatref, function(list, i) {
        list = _.sortBy(list, function(obj, t) {
          obj.time;
        })
      })
      tmplData.monSpatref = spatref;

      App.page.render("monument/show", tmplData, tmplData.placemarks)
    };

    var queryCounter = _.reduce(queries, (memo, obj) => { return memo + _.size(obj) }, 0);

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
      },
      'citiesInputOptions': {
        'source': App.models.City.findByNamePrefix,
        'etl': function(cities) {
          return _.map(cities, city => ({'id': city.id, 'label': city.name}));
        }
      },
      'coauthorsInputOptions': {
        'source': App.models.Author.findByLastNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        },
        'multipleInput': true
      },
      'heritageInputOptions': {
        'source': App.models.Heritage.findByNamePrefix,
        'etl': function(herits) {
          return _.map(herits, h => ({'id': h.id, 'label': h.name}));
        }
      }
    });
  },

  "new_by_pub": function() {
    App.page.render('monument/new_by_pub', {
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
        },
        'multipleInput': true
      },
      'citiesInputOptions': {
        'source': App.models.City.findByNamePrefix,
        'etl': function(cities) {
          return _.map(cities, city => ({'id': city.id, 'label': city.name}));
        }
      },
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
