'use strict';

App.widgetMaker = new function() {
  // Виджеты для отложенного вызова.
  var deferred = [];

  // Последний выданный id для виджета.
  var lastId = 0;

  this.createWidget = function(widgetName, params) {
    if (App.widgets[widgetName]) {
      var widget = new App.widgets[widgetName](params, 'widget-' + lastId++);
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
