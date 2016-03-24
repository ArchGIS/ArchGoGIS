'use strict';

App.controllers.author = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get('id');

    // #FIXME: запрос сломанный!
    var query = JSON.stringify({
      'a:Author': {'id': id, 'select': '*'},
      '?orgs:Organization': {'id': '*', 'select': '*'},
      '?rs:Research': {'id': '*', 'select': '*'},
      '?a_WorkedIn_orgs': {'select': '*', 'collect': '+'},
      '?a_Created_rs': {}
    });

    $.post('/hquery/read', query)
      .success(function(response) {
        console.log(response);
      App.page.render('author/show', JSON.parse(response));
    });
  }
}));
