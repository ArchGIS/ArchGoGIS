'use strict';

App.models.fn = {
  "sendQuery": function(query, limit) {
    limit = limit || 500;
    var d = $.Deferred();
    this.sendQueryWithDeferred(query, d, limit);
    return d.promise();
  },

  "sendQueryWithDeferred": function(query, deferred, limit) {
    limit = limit || 500;
    $.post({
      url: `/hquery/read?limit=${limit}`,
      data: query,
      success: function(response) {
        response = JSON.parse(response);
        deferred.resolve(response)
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      }
    });

    return deferred.promise();
  },

  "sendQueries": function(query, params, limit) {
    limit = limit || 0
    var counter = 0;
    var fullResponse = [];
    var deferred = $.Deferred();

    let limitParam = (limit) ? `limit=${limit}` : ""
    _.each(params, function(val, id) {
      var completedQuery = query.replace(/NEED/g, val);
      $.post({
        url: "/hquery/read?{limitParam}",
        data: completedQuery,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        },
        success: function(response) {
          response = JSON.parse(response);

          if (_.keys(response).length > 1) {
            fullResponse[id] = response;
          } else {
            fullResponse[id] = _.values(response)[0];
          }

          if (++counter == params.length) {
            deferred.resolve(fullResponse);
          }
        }
      });
    })

    if (params.length == 0) {
      deferred.resolve(fullResponse);
    }

    return deferred.promise();
  },

  "getData": function(queries, callback, needParams, params, limit) {
    needParams = needParams || false;
    limit = limit || 0;
    var data = {};

    _.each(queries, function(query, key) {
      if (needParams) {
        $.when(App.models.fn.sendQueries(query, params, limit)).then(function(response) {
          data[key] = response;
          callback();
        });
      } else {
        $.when(App.models.fn.sendQuery(query, limit)).then(function(response) {
          _.each(response, function(val, key){
            data[key] = val;
          })
          callback();
        });
      }
    })

    return data;
  },

  "deleteNode": function(entity, id) {
    let query = {};
    query["a:"+entity] = {"id": id, "delete": "*"}
    query = JSON.stringify(query);

    console.log(query)
    $.post({
      url: "/hquery/delete",
      data: query,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: function(response) {
        console.log(response)
      }
    });
  }
}