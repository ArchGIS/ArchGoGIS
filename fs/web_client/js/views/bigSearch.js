'use strict';

App.views.bigSearch = new (Backbone.View.extend({
  'index': function() {
    App.views.map();

    let queries = {
      author: {
        "main": {
          "author:Author": {"id": "*", "select": "*"},
        },
        "research-year-less": {
          "research_IDPLACE:Research": {"id": "*", "filter": "year=VALUEPLACE=less"},
          "research_IDPLACE__author": {"id": "*"},
        },
        "research-year-more": {
          "research_IDPLACE:Research": {"id": "*", "filter": "year=VALUEPLACE=more"},
          "research_IDPLACE__author": {"id": "*"},
        },
        "author-name": {
          "author:Author": {"id": "*", "select": "*", "filter": "name=VALUEPLACE=text"},
        },
        "artifact-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {"id": "*"},
          "research_IDPLACE__knowledge_IDPLACE": {"id": "*"},
          "knowledge_IDPLACE__artifact_IDPLACE": {"id": "*"},
        },
        "monument-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*", "filter": "monument_name=VALUEPLACE=text"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "research_IDPLACE__author": {"id": "*"},
          "research_IDPLACE__knowledge_IDPLACE": {"id": "*"},
          "monument_IDPLACE__knowledge_IDPLACE": {"id": "*"},
          "monument_IDPLACE__knowledges_IDPLACE": {"id": "*"},
        },
      },

      research: {
        "main": {
          "research:Research": {"id": "*", "select": "*"},
        },
        "research-year-less": {
          "research:Research": {"id": "*", "select": "*", "filter": "year=VALUEPLACE=less"},
        },
        "research-year-more": {
          "research:Research": {"id": "*", "select": "*", "filter": "year=VALUEPLACE=more"},
        },
        "author-name": {
          "author_IDPLACE:Author": {"id": "*", "select": "*", "filter": "name=VALUEPLACE=text"},
          "research__author_IDPLACE": {"id": "*"},
        },
        "artifact-name": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {"id": "*"},
          "knowledge_IDPLACE__artifact_IDPLACE": {"id": "*"},
        },
        "monument-name": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*", "filter": "monument_name=VALUEPLACE=text"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "research__knowledge_IDPLACE": {"id": "*"},
          "monument_IDPLACE__knowledge_IDPLACE": {"id": "*"},
          "monument_IDPLACE__knowledges_IDPLACE": {"id": "*"},
        },
      },

      monument: {
        "main": {
          "monument:Monument": {"id": "*", "select": "*"},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "monument__knowledges": {"id": "*"},
        },
        "research-year-less": {
          "research_IDPLACE:Research": {"id": "*", "filter": "year=VALUEPLACE=less"},
          "research_IDPLACE__knowledges": {"id": "*"},
        },
        "research-year-more": {
          "research_IDPLACE:Research": {"id": "*", "filter": "year=VALUEPLACE=more"},
          "research_IDPLACE__knowledges": {"id": "*"},
        },
        "author-name": {
          "author_IDPLACE:Author": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE:Research": {"id": "*"},
          "research_IDPLACE__knowledges": {"id": "*"},
          "research_IDPLACE__author_IDPLACE": {"id": "*"},
        },
        "artifact-name": {
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "knowledges__artifact_IDPLACE": {"id": "*"},
        },
        "monument-name": {
          "knowledges:Knowledge": {"id": "*", "select": "*", "filter": "monument_name=VALUEPLACE=text"},
        },
      }
    };

    var criterionId = 1;
    $('#add-criterion-button').on('click', function(e) {
      var localCriterionId = criterionId;
      var params = {
        criterionId: localCriterionId
      }

      App.template.get("bigSearch/criterion", function(tmpl) {
        $('#add-criterion-button').before(tmpl(params));
      })
      criterionId++;
    });

    $("#show-results-button").on("click", function() {
      let entity = $("#search-object").val();
      let query = _.clone(queries[entity].main);
      let criteria = $(".criterion");

      _.each(criteria, function(krit, i) {
        let $krit = $(krit);
        let criterion = $("#search-criterion-"+i).val();
        let value = $("#search-value-"+i).val();  

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