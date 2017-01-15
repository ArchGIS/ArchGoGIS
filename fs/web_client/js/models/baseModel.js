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

    $.post("/hquery/read", query)
      .success(response => resolve($.parseJSON(response).rows))
      .error(reject);
  })
};