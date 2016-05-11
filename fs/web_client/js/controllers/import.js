'use strict';

App.controllers.import = new (App.View.extend({
	'load_data': function() {
		App.page.render('import/load_data', {
			'archmapSearchOptions': {
				'source': App.models.ArchMap.findByNamePrefix,
				'etl': function(archmaps) {
					return _.map(archmaps, am => ({'id': am.id, 'label': am.name}));
				}
			}
		});
	}
}));