'use strict';

App.template = new function() {
  var cache = {};

  this.get = function(templateName, onLoad) {
    if (!_.has(cache, templateName)) { // Не загружено и не в очереди?
      cache[templateName] = 'loading'; // Помечаем как загружаемую.

      $.get('/web_client/templates/' + templateName, function(tmplText) {
        cache[templateName] = tmplText;
        onLoad(tmplText)
      });
    } else if (cache[templateName] != 'loading') { // Уже загружено?
      onLoad(cache[templateName]);
    }
  }
};