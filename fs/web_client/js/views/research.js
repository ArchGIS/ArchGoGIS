'use strict';

App.views.research = new (App.View.extend({
	"show": function(argument) {
		App.views.functions.setAccordion("accordion");
	},

	"new": function(argument) {
		var counter = 1;
		var fmt = App.fn.fmt;
		
		fillSelector($("#research-type-selector"), "ResearchType", "Аналитическое");
		setSelectsEvents();

		var fillResearchInputs = function(){
      var year = $("#research-year-input").val();
      var name = $("#report-name-input").val() + " - " + year;
      $("#research-name-input").val(name);
    };

		$('#send-button').on('click', function() {
			fillResearchInputs();

			if ( validateCreatePages() ) {
				postQuery();
			} else {
				alert('Недостаточно данных. Заполните все обязательные поля!');
			}
		});

		var authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Report.findByAuthorId(ui.item.id).then(function(reports) {
        $('#report-input').autocomplete({
          source: _.map(reports, function(report) {
            return {'label': fmt('$name ($year)', report), 'id': report.id}
          })
        });
      });

      $("#report-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          $("#report-input-id").val(ui.item.id);
        }
      }).focus(function() {
        $(this).autocomplete("search");
      });
    };

    var citySelectHandler = function(event, ui) {
      console.log(ui.item.id);
      $('#report-city-input-id').val(ui.item.id);

      App.models.Org.findByCityId(ui.item.id).then(function(orgs) {
        $('#report-organization-input').autocomplete({
          source: _.map(orgs, function(org) {
            return {'label': org.name, 'id': org.id}
          })
        });
      });

      $("#report-organization-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          $("#report-organization-input-id").val(ui.item.id);
        }
      }).focus(function() {
        $(this).autocomplete("search");
      });
    };

		var lastSelectedAuthorId = 0;
		$('#author-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        authorSelectHandler(event, ui);
      } 
    });

		var lastSelectedCityId = 0;
    $('#report-city-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedCityId != ui.item.id) {
        lastSelectedCityId = ui.item.id;
        citySelectHandler(event, ui);
      } 
    });

		function addCoord (name, id, datafor) {
			return $("<div>")
					.addClass("form-group")
					.append($("<label>")
						.attr("for", name+id)
						.text(`Координата ${name}`))
					.append($("<input>")
						.addClass("form-control")
						.attr({
							"id": name+id,
							"data-for": `exc${id}:Excavation`,
							"disabled": true,
							"type": "text",
							"name": name
						}))
		}

		function addExcName(id) {
      return $("<div>")
      	.addClass("form-group")
      	.append($("<label>")
						.attr("for", `excavation-name-input-${id}`)
						.text(`Название ${id}`))
      	.append($("<input>")
						.addClass("form-control")
						.attr({
							"id": `excavation-name-input-${id}`,
							"data-for": `exc${id}:Excavation`,
							"type": "text",
							"name": "name"
						}))
		}

		function addExcArea(id) {
      return $("<div>")
      	.addClass("form-group")
      	.append($("<label>")
						.attr("for", `excavation-area-input-${id}`)
						.text(`Выкопанная площадь (м²)`))
      	.append($("<input>")
						.addClass("form-control")
						.attr({
							"id": `excavation-area-input-${id}`,
							"data-for": `exc${id}:Excavation`,
							"type": "number",
							"name": "area"
						}))
		}

		$('#add-exc-button').on('click', function(e) {
			var coords = $("<div>")
				.addClass("coords")
				.attr("id", "coord-picker"+counter)
				.append(addCoord("X", counter))
				.append(addCoord("Y", counter))

			$(this).before(addExcName(counter));
			$(this).before(addExcArea(counter));
			$(this).before(coords);

			var coordpicker = App.blocks.coordpicker;
			coordpicker($('#coord-picker'+counter), {
				inputs: ['#X'+counter, '#Y'+counter],
				map: 'map'
			}, counter);

			counter++;
		})

		$('#add-exc-button').trigger("click");
	}
}))