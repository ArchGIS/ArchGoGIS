"use strict";

App.models.Culture = function Monument() {
  var props = {};
  App.models.proto.call(this, App.models.Monument.scheme, props);
};

App.models.Culture.getAll = function() {
  let d = $.Deferred();
  let query = {};
  query['rows:Culture'] = {"id": "*", "select": "*"};
  query = JSON.stringify(query);

  $.post({
    url: "/hquery/read",
    data: query,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
    },
    success: (response) => {
      d.resolve(JSON.parse(response).rows);
    }
  });

  return d.promise();
};

App.models.Culture.scheme = {
  "name": {"type": "text"}
};
