'use strict';

App.models.Report = function() {};

App.models.Report.findByAuthorIdFullInfo = function(authorId) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'a:Author': {'id': authorId.toString()},
      'r:Report': {'id': '*', 'select': '*'},
      'res:Research': {'id': '*', 'select': '*'},
      'rt:ResearchType': {'id': '*', 'select': '*'},
      'r__hasauthor__a': {},
      'res__has__r': {},
      'res__has__rt': {},
      'res__hasauthor__a': {}
    });
    
    $.post('/hquery/read', query)
      .success(response => resolve($.parseJSON(response)))
      .error(reject);
  });
};

App.models.Report.findByAuthorId = function(authorId) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'a:Author': {'id': authorId.toString()},
      'r:Report': {'id': '*', 'select': '*'},
      'r__hasauthor__a': {},
    });
    
    $.post('/hquery/read', query)
      .success(response => resolve($.parseJSON(response).r))
      .error(reject);
  });
};

App.models.Report.url = function(id) {
  return id ? '#report/show/' + id : '#report/show';
};

App.models.Report.href = function(id, text) {
  return '<a href="' + App.models.Report.url(id) + '">' + text + '</a>';
};
