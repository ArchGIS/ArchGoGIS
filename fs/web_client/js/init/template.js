'use strict';

App.template = new function() {
  var memo = {};  

  this.get = function(templateName, onLoad) {
    if (!_.has(memo, templateName)) { // Не загружено и не в очереди?
      memo[templateName] = 'loading'; // Помечаем как загружаемую.

      $.get('/web_client/templates/' + templateName + '.html', function(tmplText) {
        memo[templateName] = _.template(tmplText); // Компилируем и сохраняем.
        onLoad(memo[templateName]);
      });
    } else if (memo[templateName] != 'loading') { // Уже загружено?
      onLoad(memo[templateName]);
    }
  }
};
