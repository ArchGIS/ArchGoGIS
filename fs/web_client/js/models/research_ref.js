"use strict";

(function() {
  function ResearchRef() {
    App.models.base.call(this, ResearchRef.scheme);
  }

  ResearchRef.scheme = {
    "Author.name": {"type": "text"},
    "Research.year": {"type": "number"},
    "Research.type": {"type": "text"}
  };

  ResearchRef.presentation = {
    "Author.name": {"t": "Author.name"},
    "Research.year": {"t": "Research.prop.year"},
    "Research.type": {"t": "Research.type"}
  };

  App.models.ResearchRef = ResearchRef;
}());
