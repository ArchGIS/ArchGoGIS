"use strict";

(function() {
  function LiteratureRef() {
    App.models.base.call(this, LiteratureRef.scheme);
  }

  LiteratureRef.scheme = {
    "publicationYear": {"type": "number"},
    "isbn": {"type": "text"},
    "udc": {"type": "text"},
    "pages": {"type": "range"},
    "Author.name": {"type": "text"},
  };

  LiteratureRef.presentation = {
    "publicationYear": {"t": "Literature.prop.publicationYear"},
    "isbn": {"t": "Literature.prop.isbn"},
    "udc": {"t": "Literature.prop.udc"},
    "pages": {"t": "LiteratureRef.prop.pages"},
    "Author.name": {"t": "Author.name"}
  };

  App.models.LiteratureRef = LiteratureRef;
}());
