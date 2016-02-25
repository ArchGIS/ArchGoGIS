'use strict';

App.router = new (Backbone.Router.extend({
  'currentController': {},
  
  'routes': {
    '*actions': function(dispathInfo) {
      
      if (!dispathInfo) {
	return; // Скорее всего, это root action, но мы его пока не обрабатываем.
      }
      
      // Предварительная очистка.
      if (this.currentController.destruct) {
        this.currentController.destruct();
      }
      App.$body.empty();
      
      // Далее пытаемся запустить action контроллера:
      
      var controllerNameAndAction = dispathInfo.split('/');
      if (controllerNameAndAction.length != 2) {
	throw 'invalid controller/action: ' + controllerNameAndAction;
      } 
      
      var controllerName = controllerNameAndAction[0];
      var controllerAction = controllerNameAndAction[1];
      if (!_.has(App.controllers, controllerName)) {
        throw 'controller ' + controllerName + ' is undefined';
      }
      
      if (controllerAction.length == 0) {
        controllerAction = 'index';
      }

      if (!App.controllers[controllerName][controllerAction]) {
        throw 'controller ' + controllerName + ' has no action ' + controllerAction;
      }
      
      this.currentController = App.controllers[controllerName];
      App.controllers[controllerName][controllerAction]();
    }
  }
}));

Backbone.history.start({
  'pushstate': true
});
