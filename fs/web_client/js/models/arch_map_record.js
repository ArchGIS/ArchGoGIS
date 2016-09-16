"use strict";

(function() {
  function ArchMapRecord() {
    App.models.base.call(this, ArchMapRecord.scheme);
  }

  ArchMapRecord.scheme = {
    "n": {"type": "number"},
    "pages": {"type": "range"}
  };

  ArchMapRecord.presentation = {
    "n": {"t": "ArchMapRecord.n"},
    "pages": {"t": "ArchMapRecord.pages"}
  };

  App.models.ArchMapRecord = ArchMapRecord;
}());
