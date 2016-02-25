(function() {
  'use strict';

  var page = new function() {
    var $body = $('#body');
    var $title = $('#title');

    this.render = function(templateName, templateParams) {
      // Здесь должен быть запуск view, скорее всего...
      // Сама view уже должна знать свой title.
      
      templateParams = templateParams || {};
      App.template.get(templateName, function(tmpl) {
	$body.html(tmpl(templateParams));
      });

      $title.text(templateName);
    };

    this.clear = function() {
      $body.empty();
    };
  }();

  window.App = {
    'page': page,
    'template': {},
    'router': {},
    'controllers': {},
    'views': {},
    'models': {},
    'Model': {},
    'View': {},
  };
}());



App.Controller = Backbone.View.extend({});
App.View = Backbone.View.extend({});
App.Model = Backbone.Model.extend({});
