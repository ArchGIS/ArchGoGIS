'use strict';

App.locale = new function() {
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
      return translation && translation[key] ? translation[key] : undefined
    }, dict);
  };
};

App.locale.set('ru'); // Язык стоит брать из куков.
