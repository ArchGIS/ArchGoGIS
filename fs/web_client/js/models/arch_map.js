"use strict";

(function() {
  function ArchMap(key) {
    App.models.base.call(this, key, ArchMap.scheme);
  }

  ArchMap.scheme = {
    "Organization.vendorCode": {"type": "number"},
    "Organization.storeSince": {"type": "number"}
  };

  ArchMap.findByNamePrefix = function(name) {
    return new Promise(function(resolve, reject) {
      var url = App.url.make("/search/archMaps", {"needle": name, "limit": 10});

      $.get(url)
	.success(response => resolve($.parseJSON(response)))
	.error(reject);
    });
  };

  App.models.ArchMap = ArchMap;
}());
