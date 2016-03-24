'use strict';

App.models.Report = function() {};

App.models.Report.findByAuthorId = function(authorId) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'a:Author': {'id': authorId.toString()},
      'r:Report': {'id': '*', 'select': '*'},
      'a_Created_r': {}
    });
    
    $.post('/hquery/read', query)
      .success(response => resolve($.parseJSON(response).r))
      .error(reject);
  });
};

App.models.Report.url = function(id) {
  return id ? '#Report/show/' + id : '#Report/show';
};

App.models.Report.href = function(id, text) {
  return '<a href="' + App.models.Report.url(id) + '">' + text + '</a>';
};
