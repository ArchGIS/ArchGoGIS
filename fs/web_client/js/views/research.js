'use strict';

App.views.research = new (App.View.extend({
	"show": function(argument) {
		App.views.functions.setAccordion("accordion");
	}
}))