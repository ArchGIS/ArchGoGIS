'use strict';

App.widgetMaker = new function() {
  // Виджеты для отложенного вызова.
  var deferred = [];

  // Последний выданный id для виджета.
  var lastId = 0;

  this.createWidget = function(widgetName, params, id) {
    if (App.widgets[widgetName]) {
      var widget = null;
      
      if (id) {
	// Явно переданный id. Widget сохраняем в объектах страницы.
	// Далее его можно получить через App.page.get(id).
	widget = new App.widgets[widgetName](params, id);
	App.page.registerObject(id, widget);
      } else {
	// Генерируем id сами, не добавляем Widget в пул объектов страницы.
	widget = new App.widgets[widgetName](params, 'widget-' + lastId++);
      }
      
      deferred.push(widget);
      return widget.early();
    } else {
      throw 'unknown widget: ' + widgetName;
    }
  };

  this.runDefers = function() {
    _.invoke(deferred, 'later');
    deferred = [];
  };
};
