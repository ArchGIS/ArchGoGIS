'use strict';

App.models.fn = {
  "sendQuery": function(query) {
    var d = $.Deferred();
    this.sendQueryWithDeferred(query, d);
    return d.promise();
  },

  "sendQueryWithDeferred": function(query, deferred) {
    $.post({
      url: "/hquery/read",
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

  "sendQueries": function(query, params) {
    var counter = 0;
    var fullResponse = [];
    var deferred = $.Deferred();

    _.each(params, function(val, id) {
      var completedQuery = query.replace(/NEED/g, val);
      $.post({
        url: "/hquery/read",
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

  "getData": function(queries, callback, needParams, params) {
    needParams = needParams || false;
    var data = {};

    _.each(queries, function(query, key) {
      if (needParams) {
        $.when(App.models.fn.sendQueries(query, params)).then(function(response) {
          data[key] = response;
          callback();
        });
      } else {
        $.when(App.models.fn.sendQuery(query)).then(function(response) {
          _.each(response, function(val, key){
            data[key] = val;
          })
          callback();
        });
      }
    })

    return data;
  }
}