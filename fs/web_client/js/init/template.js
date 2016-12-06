'use strict';

App.template = new function() {
  var t = App.locale.translate;
  var memo = {};  

  /*
  function input(opts) {
    return opts.id ? input.templates["withId"](opts) : input.templates["noId"](opts);
  }
  input.templates = {
    "noId": _.template(`<label><%= label %><input/></label>`),
    "withId": _.template(`<label><%= label %><input id="<%= id %>"/></label>`)
  };
  */
  function input(opts, name) {
    console.log(opts);
    if (opts.name) {
      // Создание input'а на основе модели
      var labelText = t(opts.name + ".prop." + name);
    }
  }

  function maybe(object, defaultText, key) {
    key = key || "";
    defaultText = defaultText || "Нет данных";
    if (key && object) {
      return object[key] ? object[key] : defaultText;
    }

    return (typeof(object) != "object") ? object : defaultText;
  }

  // То, что передаётся в каждый шаблон в любом случае.
  var defaultContext = {
    't': App.locale.translate,
    'form': App.form,
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
