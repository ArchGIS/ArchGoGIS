'use strict';

App.template = new function() {
  var memo = {};  

  function input(opts) {
    return opts.id ? input.templates["withId"](opts) : input.templates["noId"](opts);
  }
  input.templates = {
    "noId": _.template(`<label><%= label %><input/></label>`),
    "withId": _.template(`<label><%= label %><input id="<%= id %>"/></label>`)
  };

  function maybe(object) {
    return object ? object : '?';
  }
  
  // То, что передаётся в каждый шаблон в любом случае.
  var defaultContext = {
    't': App.locale.translate,
    'widget': App.widgetMaker.createWidget,
    'block': App.blockMaker.createBlock,
    'endblock': '</div>',
    'input': input,
    'maybe': maybe
  };

  // Добавить в контекст шаблона параметры по умолчанию.
  function withDefaultContext(tmplParams) {
    return tmplParams ? $.extend(defaultContext, tmplParams) : defaultContext;
  }

  // Оборачиваем запускающую шаблон функцию в функцию, которая
  // пропустит явные шаблонные аргументы через наш defaultContext.
  function wrapTemplateInContext(tmpl) {
    return tmplParams => tmpl(withDefaultContext(tmplParams));
  }
  
  this.get = function(templateName, onLoad) {
    if (!_.has(memo, templateName)) { // Не загружено и не в очереди?
      memo[templateName] = 'loading'; // Помечаем как загружаемую.

      $.get('/web_client/templates/' + templateName + '.html', function(tmplText) {
        // Компилируем и сохраняем.
        memo[templateName] = wrapTemplateInContext(_.template(tmplText));
        // Отдаём новый шаблон.
        onLoad(memo[templateName]);
      });
    } else if (memo[templateName] != 'loading') { // Уже загружено?
      onLoad(memo[templateName]);
    }
  }
};
