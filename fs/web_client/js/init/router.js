'use strict';

(function() {
  var currentController = {};
  var controllerName = '';
  var controllerAction = '';

  function cleanup() {
    App.page.clear();
  }

  function parseUrl(dispatchInfo) {
    var parts = dispatchInfo.split('/');
    if (parts.length < 2) { // Неправильный формат url
      throw 'invalid controller/action: ' + parts.join('/');
    }
    
    controllerName = parts[0]
    controllerAction = parts[1].length > 0 ? parts[1] : 'index';
    
    // Всё после controller/action - параметры
    App.url.bindParams(parts.slice(2)); 
  }

  function validateControllerInfo() {
    if (!_.has(App.controllers, controllerName)) {
      throw 'controller ' + controllerName + ' is undefined';
    }

    if (!App.controllers[controllerName][controllerAction]) {
      throw 'controller ' + controllerName + ' has no action ' + controllerAction;
    }
  }

  function dispatch() {
    currentController = App.controllers[controllerName];

    if (currentController.start) {
      currentController.start();
    }
    
    currentController[controllerAction]();
  }
  
  window.App.router = new (Backbone.Router.extend({
    'current': {
      'controller': function() { return controllerName; },
      'action': function() { return controllerAction; }
    },
    'routes': {
      '*actions': function(dispathInfo) {
        try {
          if (!dispathInfo) {
            return; // Скорее всего, это root action, но мы его пока не обрабатываем.
          }
          
          parseUrl(dispathInfo);
          cleanup();
          validateControllerInfo();
          dispatch();
        } catch (e) {
          console.error(e);
          App.page.render('e404');
        }
      }
    }
  }));
}());

Backbone.history.start({
  'pushstate': true
});
