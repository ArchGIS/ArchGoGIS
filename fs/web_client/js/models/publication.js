"use strict";

App.models.Publication = function Publication() {
  var props = {};
};

App.models.Publication.findByAuthorId = function(authorId) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'a:Author': {'id': authorId.toString()},
      'pub:Publication': {'id': '*', 'select': '*'},
      'res:Research': {'id': '*', 'select': '*'},
      'pub__hasauthor__a': {},
      'res__has__pub': {},
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

App.models.Publication.url = function(id) {
  return id ? '#publication/show/' + id : '#publication/show';
};

App.models.Publication.href = function(id, text) {
  return '<a href="' + App.models.Publication.url(id) + '">' + text + '</a>';
};