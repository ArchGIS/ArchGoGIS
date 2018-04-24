'use strict';

App.locale.set(App.locale.getLang());

App.store = {};
App.store.coauthors = {};
App.store.categories = {};
App.store.materials = {};
App.store.selectData = {};

App.store.mapTypes = {
  monument: {name: App.locale.translate('monument.plural'), show: true},
  excavation: {name: App.locale.translate('excavation.plural'), show: true},
  heritage: {name: App.locale.translate('heritage.singular'), show: true},
  research: {name: App.locale.translate('research.plural'), show: true},
  artifact: {name: App.locale.translate('artifact.plural'), show: true},
  radiocarbon: {name: App.locale.translate('radiocarbon.plural'), show: true},
  climat: {name: App.locale.translate('climat.plural'), show: false}
};

App.store.pathToIcons = {
  monument: 'monTypes',
  excavation: 'excTypes',
  heritage: 'heritage',
  radiocarbon: 'radiocarbon',
  research: 'resTypes',
  artifact: 'artifacts'
}
