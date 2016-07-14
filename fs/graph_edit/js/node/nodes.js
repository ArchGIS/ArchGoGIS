"use strict";

(function() {
  var t = App.locale.translate;
  
  var Base = App.node.Base;

  function Excavations(id) {
    Base.call(this, id, Excavations);
  }
  Excavations.actions = {
    "add": [
      "Artifact",
      "MonumentPhoto",
      "ExcavationsPhoto",
      "Monument"
    ]
  };

  function MonumentPhoto(id) {
    Base.call(this, id, MonumentPhoto);
  }
  MonumentPhoto.actions = {};

  function ExcavationsPhoto(id) {
    Base.call(this, id, ExcavationsPhoto);
  }
  ExcavationsPhoto.actions = {};

  function ArtifactPhoto(id) {
    Base.call(this, id, ArtifactPhoto);
  }
  ArtifactPhoto.actions = {};

  function Monument(id) {
    Base.call(this, id, Monument);
  }
  Monument.actions = {};

  function Artifact(id) {
    Base.call(this, id, Artifact);
  }
  Artifact.actions = {};

  function CoAuthor(id) {
    Base.call(this, id, CoAuthor);
  }
  CoAuthor.actions = {};

  function ArchMap(id) {
    Base.call(this, id, ArchMap);
  }
  ArchMap.actions = {};
    
  App.node = {
    "Base": Base,
    "Monument": Monument,
    "ExcavationsPhoto": ExcavationsPhoto,
    "MonumentPhoto": MonumentPhoto,
    "ArtifactPhoto": ArtifactPhoto,
    "Research": Research,
    "Excavations": Excavations,
    "Artifact": Artifact,
    "Author": Author,
    "CoAuthor": CoAuthor,
    "ArchMap": ArchMap
  };
}());
