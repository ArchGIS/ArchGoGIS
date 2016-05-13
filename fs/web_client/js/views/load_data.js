'use strict';

App.views.import = new (App.View.extend({
	'load_data': function() {
		var requestToExcelParser = function(file) {
			// Отправляем запрос парсеру, получаем JSON-ответ
			// Пока захардкодим ответ
			// var resp = {"errors": ["Hello", "Bye"]};
			var resp = {
				"notices": [
					{
						"line": 10,
						"text": "Whatever",
						"cells": ["Some error", "Another error", "And another"]
					},
					{
						"line": 13,
						"text": "Whatever",
						"cells": ["Some error", "Another error", "Dude what?"]
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
				table.later();
				
				$('.error-message').html(tmpl);
				table.setHead(resp.header);
				_.each(resp.notices, function(el) {
					table.setBody(el.cells);
					table.appendRow(el.text);
				});
			} else {
				// Обработка правильных данных
			}
		};

		var $file = $("#excel_file");

		$("#goto-load").on("click", function() {
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