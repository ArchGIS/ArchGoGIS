"use strict";

(function() {
  function Epoch(key) {
    App.models.base.call(this, key, Epoch.scheme);
  }

  Epoch.getEnum = function() {
    return new Promise(function(resolve) {
      resolve(App.locale.translate("Epoch.enum"));
    });
  };

  Epoch.scheme = {
    "name": {"type": "text"}
  };

  App.models.Epoch = Epoch;
}());
