'use strict';

App.controllers.author = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get('id');

    var query = JSON.stringify({
      'a:Author': {'id': id, 'select': '*'},
      '?orgs:Organization': {'id': '*', 'select': '*'},
      '?a_WorkedIn_orgs': {'select': '*', 'collect': '+'}
    });

    $.post('/hquery/read', query)
      .success(function(response) {
        console.log(response);
      App.page.render('author/show', JSON.parse(response));
    });
  }
}));
