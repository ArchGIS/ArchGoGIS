'use strict';

App.controllers.author = new (App.View.extend({
	"show": function() {
		App.url.setMapping(["id"]);
		var id = App.url.get("id");
		var data = {};
		data['orgs'] = {};
		data['researches'] = {};
		data['placemarks'] = [];
		data['pubs'] = {};
		data['pubsco'] = {};
		data['photos'] = {};
		data['resType'] = {};

		var d1 = $.Deferred();
		var d2 = $.Deferred();
		var d3 = $.Deferred();
		var d4 = $.Deferred();
		var d5 = $.Deferred();
		var d6 = $.Deferred();

		var query = JSON.stringify({
			"author:Author": {"id": id, "select": "*"},
			"researches:Research": {"id": "*", "select": "*"},
			"researches_hasauthor_author": {},
		});

		var query_photos = JSON.stringify({
			"author:Author": {"id": id, "select": "*"},
			"photos:Image": {"id": "*", "select": "*"},
			"author_has_photos": {}
		});

		var query_get_orgs = JSON.stringify({
			"author:Author": {"id": id, "select": "*"},
			"jobs:AuthorJob": {"id": "*", "select": "*"},
			"orgs:Organization": {"id": "*", "select": "*"},
			"author_has_jobs": {},
			"jobs_belongsto_orgs": {},
		});

		var query_get_publications = JSON.stringify({
			"author:Author": {"id": id, "select": "*"},
			"pubs:Publication": {"id": "*", "select": "*"},
			"pubtype:PublicationType": {"id": "*", "select": "*"},
			"pubs_has_pubtype": {},
			"pubs_hasauthor_author": {},
		});

		var query_get_copublications = JSON.stringify({
			"author:Author": {"id": id, "select": "*"},
			"pubsco:Publication": {"id": "*", "select": "*"},
			"pubcotype:PublicationType": {"id": "*", "select": "*"},
			"pubsco_hascoauthor_author": {},
			"pubsco_has_pubcotype": {},
		});

		$.post("/hquery/read", query_get_orgs).success(function(response) {
			response = JSON.parse(response);
			if (!response['jobs']) {
				response['jobs'] = {};
			}
			data = $.extend(data, response);
			d1.resolve()
		});

		$.post("/hquery/read", query).success(function(response) {
			response = JSON.parse(response);
			data = $.extend(data, response);
			var queryCounter = 0;
			var queryCounter2 = 0;
			var monumentCounter = 1;

			$.each(data.researches, function(resid, research) {
				var query_knowledge = JSON.stringify({
					"researches:Research": {"id": research.id+""},
					"knowledges:Knowledge": {"id": "*", "select": "*"},
					"researches_has_knowledges": {}
				});

				$.post("/hquery/read", query_knowledge).success(function(response) {
					response = JSON.parse(response);
					$.each(response.knowledges, function(knowid, knowledge) {

						data.placemarks.push({
							"coords": [knowledge.x, knowledge.y],
							"pref": {
								"hintContent": knowledge.monument_name,
								"iconContent": resid+1,
							}
						})
					})

					if (++queryCounter == data.researches.length) {
						d2.resolve()
					}
				})

				var query_get_resType = JSON.stringify({
					"researches:Research": {"id": research.id+""},
					"resType:ResearchType": {"id": "*", "select": "*"},
					"researches_has_resType": {},
				});

				$.post("/hquery/read", query_get_resType).success(function(response) {
					response = JSON.parse(response);
					data.resType[queryCounter2] = response.resType[0];

					if (++queryCounter2 == data.researches.length) {
						d6.resolve()
					}
				})
			})

		});

		$.post("/hquery/read", query_get_publications).success(function(response) {
			response = JSON.parse(response);
			data = $.extend(data, response);
			d3.resolve()
		});

		$.post("/hquery/read", query_get_copublications).success(function(response) {
			response = JSON.parse(response);
			data = $.extend(data, response);
			d4.resolve()
		});

		$.post("/hquery/read", query_photos).success(function(response) {
			response = JSON.parse(response);
			data = $.extend(data, response);
			d5.resolve()
		});

		console.log(data);
		$.when(d1, d2, d3, d4, d5, d6).done(function() {App.page.render("author/show", data)});
	}
}));
