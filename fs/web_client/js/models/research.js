'use strict';


(function() {
  function Research(key) {
    App.models.base.call(this, key, Research.scheme);
  }

  Research.scheme = {
    "year": {"type": "number"},
    "code": {"type": "string"},
    "description": {"type": "text"},
    "name": {"type": "string"}
  };
}());

App.models.Research = function() {};

App.models.Research.findBy = {
  "author": function(value) {
    return new Promise(function(resolve, reject) {
      var query = JSON.stringify({
        'a:Author': {'id': authorId.toString()},
        'res:Research': {'id': '*', 'select': '*'},
        'rt:ResearchType': {'id': '*', 'select': '*'},
        'res__has__rt': {},
        'res__hasauthor__a': {}
      });

      $.post({
        url: '/hquery/read',
        data: query,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        },
        success: response => resolve($.parseJSON(response)),
        error: reject
      });
    });
  },
}

App.models.Research.findByAuthorId = function(authorId) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'a:Author': {'id': authorId.toString()},
      'res:Research': {'id': '*', 'select': '*'},
      'rt:ResearchType': {'id': '*', 'select': '*'},
      'res__has__rt': {},
      'res__hasauthor__a': {}
    });

    $.post({
      url: '/hquery/read',
      data: query,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: response => resolve($.parseJSON(response)),
      error: reject
    });
  });
};

App.models.Research.url = function(id) {
  return id ? '#research/show/' + id : '#research/show';
};

App.models.Research.href = function(id, text) {
  return '<a href="' + App.models.Research.url(id) + '">' + text + '</a>';
};
