(function() {

window.App = {
  Router: {}
};

App.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    'monuments': 'allMonuments',
    'researches': 'allResearches',
    'user/profile': 'userProfile',
    'monument/:id': 'showMon',
    'researche/:id': 'showRes'
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
});

var router = new App.Router();
Backbone.history.start({pushstate: true});

})();