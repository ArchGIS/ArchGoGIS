'use strict';

App.views.functions = {
  "setAccordion": function(accordionSelector) {
    var headers = $(accordionSelector + ' .accordion-header');

    headers.click(function() {
      var panel = $(this).next();
      var isOpen = panel.is(':visible');
   
      panel[isOpen? 'slideUp': 'slideDown']()
          .trigger(isOpen? 'hide': 'show');

      return false;
    });
  },

  "setAccordionHeader": function(header) {
    header.click(function() {
      var panel = $(this).next();
      var isOpen = panel.is(':visible');
   
      panel[isOpen? 'slideUp': 'slideDown']()
          .trigger(isOpen? 'hide': 'show');

      return false;
    });
  }
}