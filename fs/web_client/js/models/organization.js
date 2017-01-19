"use strict";

App.models.Org = function Org() {
  var props = {};
  App.models.proto.call(this, App.models.Org.scheme, props);
};

App.models.Org.findByCityId = function(id) {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      'c:City': {'id': id.toString()},
      'o:Organization': {'id': '*', 'select': '*'},
      'o__has__c': {}
    });

    $.post({
      url: '/hquery/read',
      data: query,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: response => resolve($.parseJSON(response).o),
      error: reject
    });
  });
};


App.models.Org.scheme = App.models.proto.parseScheme("Org", {
  "name": {
    "type": "text",
    "validations": []
  }
});