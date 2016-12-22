'use strict';

App.models.Artifact = function() {};

App.models.Artifact.url = function(id) {
  return id ? '#artifact/show/' + id : '#artifact/show';
};

App.models.Artifact.href = function(id, text) {
  return '<a href="' + App.models.Artifact.url(id) + '">' + text + '</a>';
};
