'use strict';

App.monuments = {
  '1': {
    'monumentName': 'Болгар',
    'monumentX': '12.3232',
    'monumentY': '53.5353',
    'monumentType': 'Городище',
    'monumentEpoch': 'Кайнозой'
  },
  '2': {
    'monumentName': 'Кармыш',
    'monumentX': '7.3232',
    'monumentY': '29.5353',
    'monumentType': 'Холм',
    'monumentEpoch': 'Мезозой'
  }
};

App.controllers.monument = new (App.View.extend({
  'show': function() {
    var query = {
      "m:Monument": {"id": "1", "select": "*"},
      "k:Knowledge": {"id": "*", "select": "*"},
      "r:Research": {"id": "*", "select": "*"},
      // "k_Describes_m": {},
      // "r_Contains_k": {}
    };
    $.post('/hquery/read', JSON.stringify(query))
    .success(function(response) {
      console.log(response);
    });

    var id = App.Url.get("id");
    App.page.render('monument', App.monuments[id]);
  },

  'new': function() {
    console.log('new monument creating');
  },

  'start': function() {
    console.log('monument controller is launched');
  },

  'finish': function() {
    console.log('monument controller is done');
  }
}));
