'use strict';

App.views.import = new (App.View.extend({
	'load_data': function() {
		$("#goto-load").on("click", function() {
			alert("hello");
		});
	}
}));