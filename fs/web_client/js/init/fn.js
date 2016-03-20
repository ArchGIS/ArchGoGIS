'use strict';

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
