'use strict';

App.views.bigSearch = new (Backbone.View.extend({
  'index': function() {
    App.views.map();

    let queries = {
      author: {
        "main": {
          "author:Author": {"id": "*", "select": "*"},
        },
        "author-name": {
          "author:Author": {"id": "*", "select": "*", "filter": "name=VALUEPLACE=text"},
        },
        "author-job": {
          "job_IDPLACE:AuthorJob": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "job_IDPLACE__author": {},
          "job_IDPLACE__org_IDPLACE": {},
        },

        "artifact-category": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cat_IDPLACE:ArtifactCategory": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "cat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-culture": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cult_IDPLACE:Culture": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "cult_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-material": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "mat_IDPLACE:ArtifactMaterial": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "mat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-photo-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataLess"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-photo-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataMore"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-found-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=more"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-found-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=less"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },

        "excavation-area-more": {
          "research_IDPLACE:Research": {"id": "*"},
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=more"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__exc_IDPLACE": {},
        },
        "excavation-area-less": {
          "research_IDPLACE:Research": {"id": "*"},
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=less"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__exc_IDPLACE": {},
        },
        "excavation-obj-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "exc_IDPLACE:Excavation": {"id": "*"},
          "obj_IDPLACE:Complex": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__exc_IDPLACE": {},
          "obj_IDPLACE__exc_IDPLACE": {},
        },
        "excavation-boss-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "boss=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__exc_IDPLACE": {},
        },

        "research-after": {
          "research_IDPLACE:Research": {"id": "*", "filter": "year=VALUEPLACE=more"},
          "research_IDPLACE__author": {},
        },
        "research-before": {
          "research_IDPLACE:Research": {"id": "*", "filter": "year=VALUEPLACE=less"},
          "research_IDPLACE__author": {},
        },
        "research-type": {
          "research_IDPLACE:Research": {"id": "*"},
          "type_IDPLACE:ResearchType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__type_IDPLACE": {},
        },

        "collection-storage": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
          "org_IDPLACE__coll_IDPLACE": {},
        },
        "collection-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
        },

        "heritage-security": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*"},
          "type_IDPLACE:SecurityType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
          "type_IDPLACE__her_IDPLACE": {},
        },
        "heritage-region": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "code=VALUEPLACE=textStart"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },
        "heritage-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataMore"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },
        "heritage-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataLess"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },

        "monument-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*", "filter": "monument_name=VALUEPLACE=text"},
          "monument_IDPLACE:Monument": {},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
        },
        "monument-culture": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "cult_IDPLACE:Culture": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "monument_IDPLACE:Monument": {},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "cult_IDPLACE__knowledges_IDPLACE": {},
        },
        "monument-type": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "type_IDPLACE:MonumentType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__type_IDPLACE": {},
        },
        "monument-epoch": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "epoch_IDPLACE:Epoch": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__epoch_IDPLACE": {},
        },
        "monument-topo-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__hastopo__topo_IDPLACE": {},
        },
        "monument-topo-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__hastopo__topo_IDPLACE": {},
        },
        "monument-photo-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__has__photo_IDPLACE": {},
        },
        "monument-photo-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__has__photo_IDPLACE": {},
        },

        "publication-place": {
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publicated_in=VALUEPLACE=text"},
          "pub_IDPLACE__author": {},
        },
        "publication-pub-name": {
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publication_name=VALUEPLACE=text"},
          "pub_IDPLACE__author": {},
        },
        "publication-title": {
          "pub_IDPLACE:Publication": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "pub_IDPLACE__author": {},
        },
      },

      research: {
        "main": {
          "research:Research": {"id": "*", "select": "*"},
        },
        "author-name": {
          "author_IDPLACE:Author": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__author_IDPLACE": {},
        },
        "author-job": {
          "author:Author": {"id": "*"},
          "job_IDPLACE:AuthorJob": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__author_IDPLACE": {},
          "job_IDPLACE__author_IDPLACE": {},
          "job_IDPLACE__org_IDPLACE": {},
        },

        "artifact-category": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cat_IDPLACE:ArtifactCategory": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "cat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-culture": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cult_IDPLACE:Culture": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "cult_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-material": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "mat_IDPLACE:ArtifactMaterial": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "mat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-name": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-photo-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataLess"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-photo-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataMore"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-found-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=more"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-found-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=less"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },

        "excavation-area-more": {
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=more"},
          "research__exc_IDPLACE": {},
        },
        "excavation-area-less": {
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=less"},
          "research__exc_IDPLACE": {},
        },
        "excavation-obj-name": {
          "exc_IDPLACE:Excavation": {"id": "*"},
          "obj_IDPLACE:Complex": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__exc_IDPLACE": {},
          "obj_IDPLACE__exc_IDPLACE": {},
        },
        "excavation-boss-name": {
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "boss=VALUEPLACE=text"},
          "research__exc_IDPLACE": {},
        },

        "research-after": {
          "research:Research": {"id": "*", "select": "*", "filter": "year=VALUEPLACE=more"},
        },
        "research-before": {
          "research:Research": {"id": "*", "select": "*", "filter": "year=VALUEPLACE=less"},
        },
        "research-type": {
          "type_IDPLACE:ResearchType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research__type_IDPLACE": {},
        },

        "collection-storage": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
          "org_IDPLACE__coll_IDPLACE": {},
        },
        "collection-name": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
        },

        "heritage-security": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*"},
          "type_IDPLACE:SecurityType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
          "type_IDPLACE__her_IDPLACE": {},
        },
        "heritage-region": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "code=VALUEPLACE=textStart"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },
        "heritage-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataMore"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },
        "heritage-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataLess"},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },

        "monument-name": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*", "filter": "monument_name=VALUEPLACE=text"},
          "monument_IDPLACE:Monument": {},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
        },
        "monument-culture": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "cult_IDPLACE:Culture": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "monument_IDPLACE:Monument": {},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "cult_IDPLACE__knowledges_IDPLACE": {},
        },
        "monument-type": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "type_IDPLACE:MonumentType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__type_IDPLACE": {},
        },
        "monument-epoch": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "epoch_IDPLACE:Epoch": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__epoch_IDPLACE": {},
        },
        "monument-topo-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__hastopo__topo_IDPLACE": {},
        },
        "monument-topo-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__hastopo__topo_IDPLACE": {},
        },
        "monument-photo-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__has__photo_IDPLACE": {},
        },
        "monument-photo-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__has__photo_IDPLACE": {},
        },

        "publication-place": {
          "author_IDPLACE:Author": {"id": "*"},
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publicated_in=VALUEPLACE=text"},
          "pub_IDPLACE__author_IDPLACE": {},
          "research__author_IDPLACE": {},
        },
        "publication-pub-name": {
          "author_IDPLACE:Author": {"id": "*"},
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publication_name=VALUEPLACE=text"},
          "pub_IDPLACE__author_IDPLACE": {},
          "research__author_IDPLACE": {},
        },
        "publication-title": {
          "author_IDPLACE:Author": {"id": "*"},
          "pub_IDPLACE:Publication": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "pub_IDPLACE__author_IDPLACE": {},
          "research__author_IDPLACE": {},
        },
      }
    };

    function changeCriterionType(id) {
      $(`#search-criterion-${id}`).on("change", function() {
        let option = $(`#search-criterion-${id} :selected`);
        let listType = $(option).attr("listType");
        let datePicker = $(option).attr("datePicker");
        let valueHeader = $(`#criterion-value-header-${id}`);

        valueHeader.next().remove()

        if (listType) {
          valueHeader.after(`<select id="search-value-${id}" class="form-control criterion-value"></select>`)
          getDataForSelector($(`#search-value-${id}`), listType);
        } else {
          valueHeader.after(`<input id="search-value-${id}" class="form-control input criterion-value">`)
        }

        if (datePicker) {
          $(`#search-value-${id}`).datepicker({
            dateFormat: "dd.mm.yy"
          });
        }
      })
    }

    var criterionId = 0;
    $('#add-criterion-button').on('click', function(e) {
      var localCriterionId = criterionId;
      var params = {
        criterionId: localCriterionId
      }

      App.template.get("bigSearch/criterion", function(tmpl) {
        $.when($('#add-criterion-button').before(tmpl(params)))
          .then(changeCriterionType(localCriterionId));
      })

      criterionId++;
    });
    $('#add-criterion-button').trigger("click");

    $("#show-results-button").on("click", function() {
      let entity = $("#search-object").val();
      let query = _.clone(queries[entity].main);
      let criteria = $(".criterion-type");

      _.each(criteria, function(krit, i) {
        let $krit = $(krit);
        let criterion = $("#search-criterion-"+i).val();
        let valueParts = $("#search-value-"+i).val().split(/[;]\s*/g);
        let value = "(" + valueParts.join(")|(") + ")";
        console.log(value)

        let addQuery = JSON.stringify(queries[entity][criterion]).replace(/_IDPLACE/g, i)
        addQuery = addQuery.replace(/VALUEPLACE/g, value)
        addQuery = JSON.parse(addQuery);

        _.extend(query, addQuery);
      })

      query = JSON.stringify(query);

      $.post("/hquery/read", query).success(function(response) {
        response = JSON.parse(response);

        if (entity == "monument") {
          _.each(response.knowledges, function(know, i) {
            response.monument[i]["name"] = know.monument_name; 
          })
        }

        let data = _.toArray(response[entity])
        data = _.uniq(data, function(item, key, id) {return item.id});

        $("#search-results").html("");
        _.each(data, function(obj, key) {
          $("#search-results").append(`<p><a href='#${entity}/show/${obj.id}'>${obj.name}</a></p>`);
        })
        console.log(response)
        console.log(data)
      });
    });
  }
}));