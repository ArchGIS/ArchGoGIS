'use strict';

App.views.functions = {
	"setAccordion": function(accordionId) {
		var headers = $('#' + accordionId + ' .accordion-header');

		headers.click(function() {
			var panel = $(this).next();
			var isOpen = panel.is(':visible');
	 
			panel[isOpen? 'slideUp': 'slideDown']()
					.trigger(isOpen? 'hide': 'show');

			return false;
		});
	}
}