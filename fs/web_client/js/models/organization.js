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
      'o_has_c': {}
    });

    $.post('/hquery/read', query)
      .success(response => resolve($.parseJSON(response).o))
      .error(reject);
  });
};


App.models.Org.scheme = App.models.proto.parseScheme("Org", {
  "name": {
    "type": "text",
    "validations": []
  }
});