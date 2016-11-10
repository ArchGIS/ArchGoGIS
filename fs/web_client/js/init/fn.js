'use strict';

/**
 * Возвращает новую строку.
 * Заменяет в pattern символы вида: $symbols
 * Вместо них подставляются свойства object.
 *
 * @param string pattern
 * @param object object
 */
App.fn.fmt = function(pattern, object) {
  return pattern.replace(/\$(\w+)/g, function(unused, word) {
    return object[word] || word;
  });
};

/**
 * Возвращает из items только те,
 * у которых строковое свойство item[key] удовлетворяет
 * регулярному выражению pattern.
 *
 * @param string pattern
 * @param array items
 * @param string key
 */
App.fn.grepObject = function(pattern, items, key) {
  var matcher = new RegExp(pattern, 'i');
  return _.filter(items, item => matcher.test(item[key]));
};

/**
 * Возвращает функцию-счётчик.
 * Пример использования:
 * next = App.fn.sequence()
 * next() = 0
 * next() = 1
 * next() = 2
 * И так далее.
 * Можно задавать начало счётчика в аргументе.
 *
 * @param int initial
 */
App.fn.sequence = function(initial) {
  initial = initial || 0;
  return () => initial++;
};

/**
 * Проверяет превышение размера файла
 * указанного в аргументе size.
 * И очищает input от файла в случае превышения.
 * 
 * @param int size
 */
App.fn.checkFileSize = function (size) {
  function convertMbToBytes(mb) {
    return mb * 1024 * 1024;
  }

  var mbInBytes = convertMbToBytes(size);
  var jqObj = $(this);

  if (jqObj[0].files[0] && jqObj[0].files[0].size > mbInBytes) {
    jqObj.val('');
  }
};

/**
 * Проверяет выход за пределы значения,
 * введённого пользователем  для поля год
 * в диапазоне [0, Текущий год].
 */
App.fn.checkYear = function () {
  var presentYear = (new Date()).getFullYear();
  var input = $(this);

  if (+input.val() < 0) {
    input.val(0);
  } else if (+input.val() > presentYear) {
    input.val(presentYear);
  }
};

/**
 * Проверяет правильность заполнения полей с автокомплитом.
 * В случае ошибки пользователя появляется сообщение об ошибке.
 * Параметр input - id тэга для оборачивания в Jquery-объект.
 * Параметр name нужен для проверки последних введённых данных в поле.
 * 
 * @param string input
 * @param string name
 */
App.fn.validInput = (input, name) => {
  var $authorInput = $(input);
  var tip = new Opentip($authorInput, {
    showOn: null,
    style: 'alert',
    target: true,
    tipJoint: 'bottom',
    hideOn: 'focus'
  });

  $authorInput.on('change', () => {
    var hiddenId = $(input + '-id').val();

    if (hiddenId && name === $authorInput.val()) {
      tip.hide();
    } else {
      tip.setContent(`Неправильный ввод.
        Введите часть искомого слова и выберите из выпадающего списка подходящий вариант.
        Если такой вариант не нашёлся, то создайте новую сущность.`);
      tip.show();
    }
  });
};

/**
 * Возвращает объект, в котором оставлены только
 * уникальные памятники. Нужен для фильтрации результатов
 * поиска памятников.
 * 
 * @param array monuments
 */
App.fn.excludeIdentMonuments = (monuments) => {
  var results = _.reduce(monuments, (memo, obj, key) => {
    if (!_.find(memo, (memoobj) => {
        return (memoobj.monId == obj[0].monId && memoobj.monName == obj[0].monName)
      })) {
      memo[key] = obj[0];
    }
    return memo;
  }, {});

  return results;
};