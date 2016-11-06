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

App.fn.checkYear = function () {
  var presentYear = (new Date()).getFullYear();
  var input = $(this);

  if (+input.val() < 0) {
    input.val(0);
  } else if (+input.val() > presentYear) {
    input.val(presentYear);
  }
};

App.fn.loading = function (load) {
  var template = `<i class="fa fa-spinner fa-pulse fa-fw"></i>
                  <span class="sr-only">Loading...</span>`;
  var saveTmpl = '';

  if (load) {
    $(this).html(load);
  } else {
    saveTmpl = $(this).html();
    $(this).html(template);
  }

  return saveTmpl;
};
