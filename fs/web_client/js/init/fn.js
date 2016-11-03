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

App.fn.sequence = function(initial) {
  initial = initial || 0;
  return () => initial++;
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
