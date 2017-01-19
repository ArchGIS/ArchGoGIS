"use strict";

(function() {
  function Collection(key) {
    App.models.base.call(this, key, Collection.scheme);
  }

  Collection.scheme = {};

  App.models.Collection = Collection;

  App.models.Collection.findByNamePrefix = function(name) {
    return new Promise(function(resolve, reject) {
      var url = App.url.make('/search/collections', {'needle': name, 'limit': 10});

      $.get({
        url,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        },
        success: response => resolve($.parseJSON(response)),
        error: reject
      });
    });
  };

  App.models.Collection.url = function(id) {
    return id ? '#collection/show/' + id : '#collection/show';
  };

  App.models.Collection.href = function(id, text) {
    return '<a href="' + App.models.Collection.url(id) + '">' + text + '</a>';
  };

}());
