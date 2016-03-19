'use strict';

App.controllers.monument = new (App.View.extend({
  'new': function() {
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
  },

  'finish': function() {
    console.log('monument controller is done');
  }
}));
