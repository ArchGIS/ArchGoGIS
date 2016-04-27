"use strict";

(function() {
  function Culture(key) {
    App.models.base.call(this, key, Culture.scheme);
  }

  Culture.getEnum = function() {
    return new Promise(function(resolve, reject) {
      var query = '{"cultures:Culture.getAll":"*"}';
      $.post("/hquery/read2/")
        .success(response => resolve($.parseJSON(response)))
        .error(reject);
    });
  };

  Culture.scheme = {
    "name": {"type": "text"}
  };

  App.models.Culture = Culture;
}());
