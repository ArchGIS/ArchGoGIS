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

App.models.Author.url = function(id) {
  return id ? '#author/show/' + id : '#author/show';
};

App.models.Author.href = function(id, text) {
  return '<a href="' + App.models.Author.url(id) + '">' + text + '</a>';
};
App.models.Author.findByLastNamePrefix = function(name) {
	var lastName = name.split(/,\s*/).pop();
	return App.models.Author.findByNamePrefix(lastName);
};
