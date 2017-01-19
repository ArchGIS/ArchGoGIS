"use strict";

App.models.baseModel = function () {
  var props = {};
};

App.models.baseModel.getData = function(entity, name) {
  return new Promise(function(resolve, reject) {
    let query = {};
    query[`rows:${entity}`] = {"id": "*", "select": "*"};

    if (name) {
      query[`rows:${entity}`]["filter"] = `name=${name}=text`
    }
    query = JSON.stringify(query);

    $.post({
      url: "/hquery/read",
      data: query,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: response => resolve($.parseJSON(response).rows),
      error: reject
    });
  });
};