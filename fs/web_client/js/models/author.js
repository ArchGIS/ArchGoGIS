'use strict';

App.models.Author = function() {};

App.models.Author.findByNamePrefix = function(name) {
  return new Promise(function(resolve, reject) {
    // #FIXME: нужно вызывать ошибку при слишком
    // длинном name префиксе.
    var url = App.url.make('/search/authors', {'needle': name, 'limit': 10});
    
    $.get(url)
      .success(response => resolve($.parseJSON(response)))
      .error(reject);
  });
};
