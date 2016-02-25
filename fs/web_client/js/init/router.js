'use strict';

App.router = new (Backbone.Router.extend({
  routes: {
    '': 'index',
    'monuments': 'allMonuments',
    'researches': 'allResearches',
    'user/profile': 'userProfile',
    'monument/:id': 'showMon',
    'researche/:id': 'showRes',
	'*actions': function() {
		alert(123);
	}
  },

  index: function() {
    $('#todoapp').html('Start page');
  },

  allMonuments: function() {
    $('#todoapp').html('monuments');
  },

  allResearches: function() {
    $('#todoapp').html('researches');
  },

  userProfile: function() {
    $('#todoapp').html('profile');
  }
}));

Backbone.history.start({
  'pushstate': true
});