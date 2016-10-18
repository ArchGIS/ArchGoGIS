'use strict';


App.controllers.research = new (App.View.extend({
	'new': function() {
		App.page.render('research', {
			'authorsInputOptions': {
				'source': App.models.Author.findByNamePrefix,
				'etl': function(authors) {
					return _.map(authors, author => ({'id': author.id, 'label': author.name}));
				}
			},
			'citiesInputOptions': {
				'source': App.models.City.findByNamePrefix,
				'etl': function(cities) {
					return _.map(cities, city => ({'id': city.id, 'label': city.name}));
				}
			}
		})
	},

	'show': function() {
		App.url.setMapping(['id']);
		var id = App.url.get("id");

		var query = JSON.stringify({
			"research:Research": {"id": id, "select": "*"},
			"author:Author": {"id": "*", "select": "*"},
			"research_hasauthor_author": {},
		});

		var get_monuments = JSON.stringify({
			"research:Research": {"id": id, "select": "*"},
			"knowledges:Knowledge": {"id": "*", "select": "*"},
			"monuments:Monument": {"id": "*", "select": "*"},
			"epoch:Epoch": {"id": "*", "select": "*"},
			"cultures:Culture": {"id": "*", "select": "*"},
			"research_has_knowledges": {},
			"knowledges_belongsto_monuments": {},
			"knowledges_has_cultures": {},
			"monuments_has_epoch": {},
		});

		var query_get_resType = JSON.stringify({
			"research:Research": {"id": id},
			"resType:ResearchType": {"id": "*", "select": "*"},
			"research_has_resType": {},
		})

		var query_coauthors = JSON.stringify({
			"research:Research": {"id": id, "select": "*"},
			"coauthors:Author": {"id": "*", "select": "*"},
			"research_hascoauthor_coauthors": {},
		});

		var query_for_reports = JSON.stringify({
			"research:Research": {"id": id, "select": "*"},
			"author:Author": {"id": "*", "select": "*"},
			"reports:Report": {"id": "*", "select": "*"},
			"reports_hasauthor_author": {},
			"research_hasreport_reports": {}
		});

		var query_used_artifacts = JSON.stringify({
			"research:Research": {"id": id},
			"knowledges:Knowledge": {"id": "*"},
			"usedArtifacts:Artifact": {"id": "*", "select": "*"},
			"knowledges_has_usedArtifacts": {},
			"research_has_knowledges": {}
		});

		var d1 = $.Deferred();
		var d2 = $.Deferred();
		var d3 = $.Deferred();
		var d4 = $.Deferred();
		var data = {};
		$.post('/hquery/read', query).success(function(researchData) {
			data = JSON.parse(researchData);
			data['reports'] = {};
			data['artifacts'] = [];
			data['placemarks'] = [];
			data['usedArtifacts'] = {};
			data['coauthors'] = {};
			data['resType'] = {};
			data['monuments'] = {};

			$.post("/hquery/read", query_coauthors).success(function(coauthors) {
				coauthors = JSON.parse(coauthors);
				data = $.extend(data, coauthors);
				d2.resolve();
				console.log("d2 complete");
			});

			$.post("/hquery/read", get_monuments).success(function(response) {
				response = JSON.parse(response);
				data = $.extend(data, response);
				d4.resolve();
				console.log("d4 complete");
			});

			$.post("/hquery/read", query_used_artifacts).success(function(used_arifacts) {
				used_arifacts = JSON.parse(used_arifacts);
				data = $.extend(data, used_arifacts);
			});

			$.post("/hquery/read", query_get_resType).success(function(response) {
				response = JSON.parse(response);
				data = $.extend(data, response);
				d3.resolve();
				console.log("d3 complete");
			});

			$.when(d4).done(function() {
				$.each(data.knowledges, function(id, knowledge) {
					query = JSON.stringify({
						"knowledge:Knowledge": {"id": knowledge.id+""},
						"artifacts:Artifact": {"id": "*", "select": "*"},
						"knowledge_founded_artifacts": {}
					});

					$.post("/hquery/read", query).success(function(artifacts) {
						artifacts = JSON.parse(artifacts);
						data.artifacts.push(artifacts.artifacts);

						if (data.knowledges.length == id+1) {
							d1.resolve();
							console.log("d1 complete");
						}
					})

					data.placemarks.push({
						"coords": [knowledge.x, knowledge.y],
						"pref": {
							"hintContent": knowledge.monument_name,
							"iconContent": id+1
						}
					})
				});

				console.log(data.knowledges);
				console.log(data);
				if (!data.knowledges) {
					d1.resolve();
					console.log("d1 complete");
				}
			});

			$.post('/hquery/read', query_for_reports).success(function(researchD) {

				_.extend(data, JSON.parse(researchD));
				console.log(data);
				$.when(d1, d2, d3, d4).done(function() {App.page.render('research_view', data)});
			});
		});
	}
}));