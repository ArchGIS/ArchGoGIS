'use strict';

App.views.admin = new (Backbone.View.extend({
  'main': function() {
    $("#show-button").on("click", function() {
      let entity = $("#entity-selector").val();
      let name = $("#entity-name-input").val();
      let query;

      if (entity == "Monument") {
        query = App.models.Monument.getData(name);
      } else {
        query = App.models.baseModel.getData(entity, name);
      }

      query.then(function(data) {
        let $results = $("#results");
        $results.html("");

        _.each(data, function(row, key) {
          $results.append(`<tr>
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td><a href="#${entity.toLowerCase()}/show/${row.id}">Редактировать</a></td>
            <td><a class="entity-delete">Удалить</a></td>
          </tr>`);
        })
      })
    })
  }
}))