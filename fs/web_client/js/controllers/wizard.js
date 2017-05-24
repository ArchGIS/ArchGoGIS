'use strict';

App.controllers.wizard = new (Backbone.View.extend({
  'create_data': function() {
    App.page.render('wizard/create_data');
  },

  'future1': function() {
    App.page.render('wizard/future1');
  },

  'future2': function() {
    App.page.render('wizard/future2');
  },

  'future3': function() {
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    let query = {
      single: {
        selections: JSON.stringify({
          "selections:Selection": {"id": "*", "select": "*"},
        })
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      console.log(tmplData);

      App.page.render('wizard/future3', tmplData);
    };

    var callRender = _.after(1, render);

    data.push(model.getData(query.single, callRender));
  },

  'future4': function() {
    App.page.render('wizard/future4');
  },

  'future5': function() {
    App.page.render('wizard/future5');
  },

  'team': function() {
    App.page.render('team');
  },
}));
