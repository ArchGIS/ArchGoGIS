"use strict";

(function() {
  var dict = {
    "form": {
      "required": "Обязательное для заполнения поле"
    },

    "Author": {
      "short": "Автор",
      "props": {
        "name": "Имя"
      }
    },

    "CoAuthor": {
      "short": "Соавтор",
      "insert": "Добавить соавтора"
    },

    "ArchMap": {
      "short": "Арх. карта",
      "insert": "Добавить археологическую карту"
    },

    "Research": {
      "short": "Иссл.",
      "insert": "Добавить исследование",
      "props": {
        "year": "Год проведения",
        "description": "Описание"
      }
    },

    "Excavations": {
      "short": "Раскопки",
      "insert": "Добавить раскопки"
    },

    "Monument": {
      "short": "Памятник",
      "insert": "Добавить памятник"
    },

    "Artifact": {
      "short": "Артефакт",
      "insert": "Добавить артефакт"
    },

    "MonumentPhoto": {
      "short": "Фото пам.",
      "insert": "Добавить фотографию памятника"
    },

    "ExcavationsPhoto": {
      "short": "Фото раск.",
      "insert": "Добавить фотографию раскопок"
    },

    "button": {
      "delete": "Удалить элемент"
    },

    "error": {
      "nonLeafRemove": "удалять можно только висячие вершины (листья графа)",
      "startingNodeRemove": "нельзя удалять стартовые вершины"
    },

    "nodeControl": {
      "tabName": "Работа с выделенным элементом"
    },

    "mapControl": {
      "tabName": "астройки карты"
    },

    "graphControl": {
      "tabName": "Настройки графа",
      "layoutNames": {
        "grid": "Сеточное выравнивание",
        "tree": "Древовидное выравнивание",
        "spread": "Свободное выравнивание"
      }
    }
  };

  var dictIndex = {};

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

  function translate(key) {
    var translation = dictIndex[key];
    if (translation) {
      return translation;
    } else {
      return `<< ${key} >>`;
    }
  }

  buildIndex(dict);  

  App.locale = {
    "translate": translate
  };
}());
