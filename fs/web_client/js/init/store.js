'use strict';

// App.locale.set('ru');

App.store = {};
App.store.coauthors = {};
App.store.categories = {};
App.store.materials = {};
App.store.selectData = {};

App.store.mapTypes = {
  monument: App.locale.translate('monument.plural'),
  excavation: App.locale.translate('excavation.plural'),
  heritage: App.locale.translate('heritage.singular'),
  research: App.locale.translate('research.plural'),
  artifact: App.locale.translate('artifact.plural')
};

App.store.pathToIcons = {
  monument: 'monTypes',
  excavation: 'excTypes',
  heritage: 'heritage',
  radiocarbon: 'radiocarbon',
  research: 'resTypes',
  artifact: 'artifacts'
}
