"use strict";

App.views.importXlsx = new (Backbone.View.extend({
  "index": function() {
    var requestToExcelParser = function(file) {
      // Отправляем запрос парсеру, получаем JSON-ответ
      // Пока захардкодим ответ
      // var resp = {"errors": ["Hello", "Bye"]};
      var resp = {
        "notices": [
          {
            "line": 10,
            "text": ["err1", "err2"],
            "cells": ["v1", "v2", "v3"]
          },
          {
            "line": 11,
            "text": ["err1", "err2"],
            "cells": ["v11", "v2", "v3"]
          }
        ],
        "header": [
          "Номер",
          "Название",
          "Ещё что-то"
        ]
      };
 
      if (resp.fatal) {
        $('.error-message').html("<span class=\"danger\">Fatal error: " + resp.fatal + "</span>");
      } else if (resp.errors) {
        var message = resp.errors.join(', ');
        $('.error-message').html("<span class=\"errors\">Errors: " + message + "</span>");
      } else if (resp.notices) {
        var table = new App.widgets.Table(null, "notice");
        var tmpl = table.early();
        
        $('.error-message').html(tmpl);
        table.later();

        table.setHead(resp.header);
        _.each(resp.notices, function(el) {
          table.setBody(el.cells, 1);
          _.each(el.text, e => table.appendRow(e, resp.header.length));
        });
      } else {
        // Обработка правильных данных
      }
    };
 
    var $file = $("#excel_file");

    $('#goto-load').click(function() {
      requestToExcelParser($file.files);
    });

    var archMapFinder = App.page.get("archmap-input");
    archMapFinder.on('autocompleteselect', function(event, ui) {
      if (ui.item) {
        console.log(ui.item.id);
        App.store.itemId = ui.item.id;
      }
    });
  }
}));
