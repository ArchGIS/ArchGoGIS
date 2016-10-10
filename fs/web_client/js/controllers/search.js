'use strict';

App.controllers.search = new (App.View.extend({
  'start': function() { console.log('search start'); },
  
  'index': function() {
    App.page.render('search', {
      'monumentSearchOptions': {
        'source': App.models.Monument.findByNamePrefix,
        'etl': function(monuments) {
          return _.map(monuments, mk => ({'id': mk[0].id, 'label': mk[1].monument_name}));
        }
      },
      'authorSearchOptions': {
        'source': App.models.Author.findByNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        }
      }
    });
  }
}));
