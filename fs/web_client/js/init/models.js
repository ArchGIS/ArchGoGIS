'use strict';

App.models.fn = {
  "sendQueryWithPromise": function(query) {
    var d = $.Deferred();
    this.sendQueryWithDeferred(query, d);
    return d.promise();
  },

  "sendQueryWithDeferred": function(query, deferred) {
    $.post("/hquery/read", query).success(function(response) {
      response = JSON.parse(response);
      deferred.resolve(response)
    });

    return deferred.promise();
  },

  "sendQueriesWithDeferred": function(query, data, deferred) {
    var counter = 0;
    var fullResponse = [];

    _.each(data, function(val, id) {
      var completedQuery = query.replace(/NEED/g, val);
      $.post("/hquery/read", completedQuery).success(function(response) {
        response = JSON.parse(response);
        if (_.keys(response).length > 1) {
          fullResponse[id] = response;
        } else {
          fullResponse[id] = _.values(response)[0];
        }

        if (++counter == data.length) {
          deferred.resolve(fullResponse);
        }
      });
    })

    return deferred.promise();
  }
}