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
      "k_Describes_m": {},
      "r_Contains_k": {},
      "a_Created_r": {},
      "?m_Contains_o": {}
    };
    $.post('/hquery/read', JSON.stringify(query))
    .success(function(response) {
      // console.log(response);
      var respObject = JSON.parse(response);
      // console.log(respObject);
      App.page.render('monument_view', respObject);
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
      }
    });
  },

  'start': function() {
    console.log('monument controller is launched');
  }
}));
