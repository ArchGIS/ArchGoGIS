'use strict';

App.page = new function() {
  var $body = $('#body');
  var $title = $('#title');

  // Объекты, локальные для страницы (controller.action);
  // Это хранилище очищается перед отрисовкой (render) следующей страницы.
  var objects = {};
  // Массив функций, которые нужно выполнить перед запуском следующей страницы.
  var destructors = [];
  
  this.render = function(templateName, templateParams) {
    var action = App.router.current.action();
    var controller = App.router.current.controller();
    
    App.template.get(templateName, function(tmpl) {
      App.locale.set(App.url.get('lang'));
      $body.html(tmpl(templateParams));
      App.widgetMaker.runDefers();
      App.blockMaker.runInitializers();
      
      // Если есть view, то запускаем и его
      if (App.views[controller]) {
      	var view = App.views[controller][action];
      	if (view) {
      	  view();
      	}
      }
    });

    $title.text(App.locale.translate([
      'titles', controllers, action
    ]));
  };

  this.clear = function() {
    _.invoke(destructors, 'call');
    objects = {};
    $body.empty();
  };

  this.get = function(name) {
    return objects[name];
  };

  this.registerObject = function(name, object) {
    if (name in objects) {
      throw name + ' already defined';
    }
    
    objects[name] = object;
  };

  this.pushDestructor = function(destructor) {
    destructors.push(destructor);
  };
};
