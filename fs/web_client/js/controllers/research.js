'use strict';

(function() {
  function Research(key) {
    App.models.base.call(this, key, Research.scheme);
  }

  Research.scheme = {
    "year": {"type": "number"},
    "type": {"type": "number"},
    "description": {"type": "text"}
  };
}());

App.models.Research = function() {};

App.models.Research.findByAuthorId = function(authorId) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'a:Author': {'id': authorId.toString()},
      'r:Research': {'id': '*', 'select': '*'},
      'r_hasauthor_a': {}
    });
    
    $.post('/hquery/read', query)
      .success(response => resolve($.parseJSON(response).r))
      .error(reject);
  });
};

App.models.Research.url = function(id) {
  return id ? '#research/show/' + id : '#research/show';
};

App.models.Research.href = function(id, text) {
  return '<a href="' + App.models.Research.url(id) + '">' + text + '</a>';
};
