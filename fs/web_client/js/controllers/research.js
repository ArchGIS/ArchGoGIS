'use strict';

App.controllers.research = new (App.View.extend({
  'new': function() {
    App.page.render('research');
  },

  'show': function() {
    App.url.setMapping(['id']);
    
    var id = App.url.get("id");

    App.page.render('research_view', {"id": id});
    console.log('research view');
  }
}));
