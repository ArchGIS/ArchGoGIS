'use strict';

App.models.Report = function() {};

App.models.Report.findByAuthorId = function(authorId) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'a:Author': {'id': authorId.toString()},
      'r:Report': {'id': '*', 'select': '*'},
      'r_hasauthor_a': {}
    });

    // var query = JSON.stringify({
    //   "author:Author.getBy": +id,
    //   "r:Report.getBy": "author",
    // });
    
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
