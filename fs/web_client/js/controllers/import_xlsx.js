"use strict";

App.controllers.importXlsx = new (App.View.extend({
  "index": function() {
    App.page.render("import_xlsx/main", {
      "archmapSearchOptions": {
	"source": App.models.ArchMap.findByNamePrefix,
	"etl": function(archmaps) {
	  return _.map(archmaps, am => ({"id": am.id, "label": am.name}));
	}
      }
    });
  }
}));
