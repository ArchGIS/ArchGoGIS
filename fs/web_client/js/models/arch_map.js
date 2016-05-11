"use strict";

(function() {
  function ArchMap(key) {
    App.models.base.call(this, key, ArchMap.scheme);
  }

  ArchMap.scheme = {
    "Organization.vendorCode": {"type": "number"},
    "Organization.storeSince": {"type": "number"}
  };

  App.models.ArchMap = ArchMap;
}());

App.models.ArchMap.findByNamePrefix = function(name) {
	return new Promise(function(resolve, reject) {
		var url = App.url.make('/search/archmap', {'needle': name, 'limit': 10});

		$.get(url)
		 .success(response => resolve($.parseJSON(response)))
		 .error(reject);
	});
};

