'use strict';

App.locale = new function() {
  let dict = {};
  let dictIndex = {}; // Для быстрого обхода словаря.
  let currentName = '';
  const supportedLangs = {
    'en': true,
    'ru': true
  };

  const ruTr = ['Я','я','Ю','ю','Ч','ч','Ш','ш','Щ','щ','Ж','ж','А','а','Б','б','В','в','Г','г','Д','д','Е','е','Ё','ё','З','з','И','и','Й','й','К','к','Л','л','М','м','Н','н', 'О','о','П','п','Р','р','С','с','Т','т','У','у','Ф','ф','Х','х','Ц','ц','Ы','ы','Ь','ь','Ъ','ъ','Э','э'];
  const enTr = ['Ya','ya','Yu','yu','Ch','ch','Sh','sh','Sh','sh','Zh','zh','A','a','B','b','V','v','G','g','D','d','E','e','E','e','Z','z','I','i','J','j','K','k','L','l','M','m','N','n', 'O','o','P','p','R','r','S','s','T','t','U','u','F','f','H','h','C','c','Y','y','`','`','\'','\'','E', 'e'];
  
  const fallbackLang = localStorage.getItem('lang') || 'en';
  // currentName = fallbackLang;

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
  };

  function setDict(dictToSet) {
    dict = dictToSet;
    dictIndex = {}; // Старый индекс становится бесполезным.
    buildIndex(dictToSet); 
  };
  
  this.getLang = function () {
    return currentName === '' ? fallbackLang : currentName;
  };

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
        localStorage.setItem('lang', name);
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
  };

  this.cyrToLatin = (text) => {
    for (let i = 0; i < ruTr.length; i++) {
      const reg = new RegExp(ruTr[i], "g");
      text = text.replace(reg, enTr[i]);
    }
    
    return text;
  };
};
