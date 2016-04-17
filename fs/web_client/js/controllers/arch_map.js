"use strict";

(function() {
  function ArchMap(key) {
    App.models.base.call(this, key, ArchMap.scheme);
  }

  ArchMap.scheme = {
    "Organization.vendorCode": {"type": "number"},
    "Organizetion.storeSince": {"type": "number"}
  };
}());
