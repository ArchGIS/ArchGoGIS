'use strict';

App.locale = new function() {
  var dict = {};
  var dictIndex = {}; // Для быстрого обхода словаря.
  var currentName = '';
  var supportedLangs = {
    'en': true,
    'ru': true
  };
  var fallbackLang = 'ru'; // Должно браться из куков.

  function buildIndex(toParse, path) {
    _.each(toParse, function(object, key) {
      // _.isObject для массивов возвращает true, а нам нужно поймать
      // именно объекты {}, поэтому тут немного хитрая проверка.
      if ('[object Object]' == Object.prototype.toString.call(object)) {
        buildIndex(object, path ? path + '.' + key : key);
      } else {
        dictIndex[path ? path + '.' + key : key] = object;
      }
    });
  }

  function setDict(dictToSet) {
    dict = dictToSet;
    dictIndex = {}; // Старый индекс становится бесполезным.
    buildIndex(dictToSet); 
  }
  
  this.set = function(name) {
    if (!supportedLangs[name]) {
      name = fallbackLang
    }
    
    if (currentName != name) {
      $.ajax({
        'url': '/locales/' + name + '.json',
        'dataType': 'json',
        'async': false // Возможно стоит сделать асинхронным
      }).success(function(newDict) {
        setDict(newDict);
        currentName = name;
      });
    }
  };
  
  this.translate = (key) => {
    var translation = dictIndex[key];
    if (translation) {
      return translation;
    } else {
      return `<< ${key} >>`;
    }
  }
};
