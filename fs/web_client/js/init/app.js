(function() {
  'use strict';

  var page = new function() {
    var $body = $('#body');
    var $title = $('#title');
    
    this.render = function(templateName, templateParams) {
      // Здесь должен быть запуск view, скорее всего...
      // Сама view уже должна знать свой title.
      
      templateParams = templateParams || {};
      
      // Здесь добавляем функции (пока одну) для рендеринга шаблона.
      templateParams.t = function(key) {
	return App.locale.translate(key.split('.'));
      };
      
      App.template.get(templateName, function(tmpl) {
	$body.html(tmpl(templateParams));
      });

      $title.text(templateName);
    };

    this.clear = function() {
      $body.empty();
    };
  }();

  var locale = new function() {
    var dict = {};
    var currentName = '';

    this.set = function(name) {
      if (currentName != name) {
	$.ajax({
	  'url': '/locales/' + name + '.json',
	  'async': false // Возможно стоит сделать асинхронным
	}).success(function(newDict) {
	  dict = newDict;
	  currentName = name;
	});
      }
    };
    
    this.translate = function(keys) {
      if (!dict[keys[0]]) {
	return undefined;
      }
      
      return _.reduce(keys, function(translation, key) {
        return translation[key] ? translation[key] : undefined
      }, dict);
    };
  }();

  window.App = {
    'page': page,
    'locale': locale,
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

App.locale.set('ru'); // Язык стоит брать из куков.
