'use strict';

App.controllers.monument = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get('id');
    
    var query = {
      "m:Monument": {"id": id, "select": "*"},
      "k:Knowledge": {"id": "*", "select": "*"},
      "r:Research": {"id": "*", "select": "*"},
      "a:Author": {"id": "*", "select": "*"},
      "?o:Object": {"id": "*", "select": "*"},
      "c:Culture": {"id": "*", "select": "*"},
      "k_Describes_m": {},
      "r_Contains_k": {},
      "k_CultureOf_c": {},
      "a_Created_r": {},
      "?m_Contains_o": {}
    };
    $.post('/hquery/read', JSON.stringify(query))
    .success(function(monumentData) {
      var query = {
        "m:Monument": {"id": id},
        "ty:MonumentType": {"id": "?", "select": "*"},
        "e:Epoch": {"id": "?", "select": "*"},
        "m_TypeOf_ty": {},
        "m_EpochOf_e": {},
      };
      $.post('/hquery/read', JSON.stringify(query))
      .success(function(ty) {
        // #FIXME: унести запрос и JSON.parse в модель    
        var respObject = JSON.parse(monumentData);
        var type = JSON.parse(ty);
        console.log($.extend(respObject, type));
        App.page.render('monument_view', $.extend(respObject, type));
      });
    });
  },

  'new': function() {
    App.page.pushDestructor(function() {
      console.log('monument controller is done (destructor)');
    });
    
    App.page.render('monument', {
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

  'start': function() {
    console.log('monument controller is launched');
  }
}));
