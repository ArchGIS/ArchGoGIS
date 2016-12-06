'use strict';

App.models.File = function() {};

App.models.File.url = function(id) {
  return id ? `${HOST_URL}/local_storage/${id}` : '#e404';
};

App.models.File.href = function(id, text) {
  return '<a target="_blank" href="' + App.models.File.url(id) + '">' + text + '</a>';
};
