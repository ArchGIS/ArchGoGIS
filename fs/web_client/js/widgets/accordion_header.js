'use strict';

App.widgets.AccordionHeader = function(title) {
  var tmpl = _.template(`
    <h4 class="accordion-header">
      <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>
      <%= title %>
    </h4>
  `);
  
  this.early = function() {
    return tmpl({'title': title});
  };

  this.later = function() {}
}