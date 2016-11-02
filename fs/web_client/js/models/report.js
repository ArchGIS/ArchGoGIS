'use strict';

App.models.Report = function() {};

App.models.Report.findByAuthorId = function(authorId) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'a:Author': {'id': authorId.toString()},
      'r:Report': {'id': '*', 'select': '*'},
      'res:Research': {'id': '*', 'select': '*'},
      'rt:ResearchType': {'id': '*', 'select': '*'},
      'r_hasauthor_a': {},
      'res_has_r': {},
      'res_has_rt': {},
      'res_hasauthor_a': {}
    });
    
    $.post('/hquery/read', query)
      .success(response => resolve($.parseJSON(response)))
      .error(reject);
  });
  
};

App.models.Report.url = function(id) {
  return id ? `${dburl}/local_storage/${id}` : '#e404';
};

App.models.Report.href = function(id, text) {
  return '<a target="_blank" href="' + App.models.Report.url(id) + '">' + text + '</a>';
};
