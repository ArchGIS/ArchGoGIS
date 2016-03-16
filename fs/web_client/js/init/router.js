'use strict';

(function() {
  var currentController = {};
  var controllerName = '';
  var controllerAction = '';
  
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

	  // Парсим GET-параметры.
	  App.Url.parse(window.location.search);
	  
	  // Предварительная очистка.
	  if (currentController.finish) {
            currentController.finish();
	  }
	  App.page.clear();
	  
	  // Далее пытаемся запустить action контроллера:
	  
	  var controllerNameAndAction = dispathInfo.split('/');
	  if (controllerNameAndAction.length != 2) {
	    throw 'invalid controller/action: ' + controllerNameAndAction;
	  } 
	  
	  controllerName = controllerNameAndAction[0];
	  controllerAction = controllerNameAndAction[1];
	  if (!_.has(App.controllers, controllerName)) {
            throw 'controller ' + controllerName + ' is undefined';
	  }
	  
	  if (controllerAction.length == 0) {
            controllerAction = 'index';
	  }

	  if (!App.controllers[controllerName][controllerAction]) {
            throw 'controller ' + controllerName + ' has no action ' + controllerAction;
	  }
	  
	  currentController = App.controllers[controllerName];
	  if (currentController.start) {
	    currentController.start();
	  }
	  currentController[controllerAction]();
	} catch (e) {
	  App.page.render('e404');
	}
      }
    }
  }));
}());
  
Backbone.history.start({
  'pushstate': true
});
