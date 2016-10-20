'use strict';

App.models.Report = function() {};

App.models.Report.findByAuthorId = function(authorId) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'a:Author': {'id': authorId.toString()},
      'r:Report': {'id': '*', 'select': '*'},
      'r_hasauthor_a': {}
    });
    
    $.post('/hquery/read', query)
      .success(response => resolve($.parseJSON(response).r))
      .error(reject);
  });
  
};

App.models.Report.url = function(id) {
  return id ? `${dburl}/local_storage/${id}` : '#e404';
};

App.models.Report.href = function(id, text) {
  return '<a target="_blank" href="' + App.models.Report.url(id) + '">' + text + '</a>';
};
