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

App.models.Publication.getPubsByName = function(term, pubType, editionType, isbn) {
  let d = $.Deferred();
  let ret = {city: null, wcity: null};
  let field = "editionName";

  if (isbn) {
    field = "isbn"
  }

  let query = JSON.stringify({
    "p:Publication": {"id": "*", "select": "*", "filter": `${field}=${term}=text`},
    "c:City": {"id": "*", "select": "*"},
    "pt:PublicationType": {"id": `${pubType}`},
    "et:EditionType": {"id": `${editionType}`},
    "c__p": {},
    "pt__p": {},
    "et__p": {},
  });

  let query2 = JSON.stringify({
    "p:Publication": {"id": "*", "select": "*", "filter": `${field}=${term}=text`},
    "pt:PublicationType": {"id": `${pubType}`},
    "et:EditionType": {"id": `${editionType}`},
    "pt__p": {},
    "et__p": {},
  });

  $.post({
    url: "/hquery/read",
    data: query,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
    },
    success: response => {
      let rows = $.parseJSON(response);
      ret.city = rows;
      if (ret.wcity !== null) {
        d.resolve(ret);
      }
    },
  });

  $.post({
    url: "/hquery/read",
    data: query2,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
    },
    success: response => {
      let rows = $.parseJSON(response);
      ret.wcity = rows;
      if (ret.city !== null) {
        d.resolve(ret);
      }
    },
  });

  return d.promise();
};

App.models.Publication.url = function(id) {
  return id ? '#publication/show/' + id : '#publication/show';
};

App.models.Publication.href = function(id, text) {
  return '<a href="' + App.models.Publication.url(id) + '">' + text + '</a>';
};