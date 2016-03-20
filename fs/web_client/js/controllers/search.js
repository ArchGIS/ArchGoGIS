'use strict';

App.controllers.search = new (App.View.extend({
  'index': function() {
    App.page.render('search', {
      'researchAuthorSearchOptions': {
	'source': App.models.Author.findByNamePrefix,
	'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        }
      }
    });
  }
}));
