'use strict';

/**
 * Заменяет в pattern символы вида: $symbols
 * Вместо них подставляются свойства object.
 *
 * @param {string} pattern
 * @param {Object} object
 * @returns {string} pattern with object properties replacements
 */
App.fn.fmt = (pattern, object) => {
  return pattern.replace(/\$(\w+)/g, (unused, word) => {
    return object[word] || word;
  });
};

/**
 * Возвращает из items только те,
 * у которых строковое свойство item[key] удовлетворяет
 * регулярному выражению pattern.
 *
 * @param {string} pattern
 * @param {Array} items
 * @param {string} key
 * @returns {Array} just items that have item[key]
 */
App.fn.grepObject = (pattern, items, key) => {
  let matcher = new RegExp(pattern, 'i');
  return _.filter(items, item => matcher.test(item[key]));
};

/**
 * Возвращает функцию-счётчик.
 * Пример использования:
 * next = App.fn.counter()
 * next() // возвратит 0
 * next() // возвратит 1
 * И так далее.
 * Можно задавать начало счётчика в аргументе.
 *
 * @param {int} initial
 * @returns {Function} were initial plus one
 */
App.fn.counter = (initial) => {
  initial = initial || 0;
  return () => initial++;
};

/**
 * Проверяет превышение размера файла
 * указанного в аргументе size.
 * И очищает input от файла в случае превышения.
 * 
 * @param {int} size
 */
App.fn.checkFileSize = function(size) {
  function convertMbToBytes(mb) {
    return mb * 1024 * 1024;
  }

  let mbInBytes = convertMbToBytes(size);
  const jqObj = $(this);

  if (jqObj[0].files[0] && jqObj[0].files[0].size > mbInBytes) {
    jqObj.val('');
  }
};

/**
 * Проверяет выход за пределы значения,
 * введённого пользователем  для поля год
 * в диапазоне [0, Текущий год].
 */
App.fn.checkYear = function() {
  const input = $(this);

  let presentYear = new Date().getFullYear();

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
 * @param {string} input
 * @param {string} name
 */
App.fn.validInput = function(input, name) {
  const $input = $('#' + input);

  const tip = new Opentip($input, {
    showOn: null,
    style: 'alert',
    target: true,
    tipJoint: 'bottom',
    hideOn: 'focus'
  });

  $input.on('change', () => {
    let hiddenId = $(`#${input}-id`).val();

    if (hiddenId && name === $input.val()) {
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
 * Фильтрация результатов поиска памятников.
 * 
 * @param {Array} monuments
 * @returns {Array} uniq results from monuments
 */
App.fn.excludeIdentMonuments = (monuments) => {
  let results = _.reduce(monuments, (memo, obj, key) => {
    if (!_.find(memo, (memoobj) => {
        return (memoobj.monId == obj.monId && memoobj.monName == obj.monName)
      })) {
      memo[key] = obj;
    }
    return memo;
  }, {});

  return results;
};


App.fn.addNameToId = (id) => {
  let mass = id.split('-');
  mass.splice(1, 0, 'name');

  return mass.join('-');
};
