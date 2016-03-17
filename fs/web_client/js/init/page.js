'use strict';

App.page = new function() {
  var $body = $('#body');
  var $title = $('#title');

  var defaultContext = {
    't': function(key) {
      return App.locale.translate(key.split('.'));
    },
    'widget': App.widgetMaker.createWidget
  };
  
  this.render = function(templateName, templateParams) {
    var action = App.router.current.action();
    var controller = App.router.current.controller();
    
    if (templateParams) {
      templateParams = _.extend(defaultContext, templateParams);
    } else {
      templateParams = defaultContext;
    }
    
    App.template.get(templateName, function(tmpl) {
      $body.html(tmpl(templateParams));
      App.widgetMaker.runDefers();
      
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
    $body.empty();
  };
};
