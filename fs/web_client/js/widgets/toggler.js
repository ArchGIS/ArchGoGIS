'use strict';

App.widgets.toggler = function(params, id) {
  var tmpl = _.template(`
    <select id=<%= id %>>
      <% _.each(options, function(option) { %>
        <option><%= option %></option>
      <% }); %>
    </select>
  `);
  
  this.early = function() {
    return tmpl({
      'options': _.pluck(params, 0),
      'id': id
    });
  };

  this.later = function() {
    var $el = $('#' + id);
    var $items = _.object(
      _.pluck(params, 0),
      _.map(params, param => $(param[1]))
    );
    var $lastSelected = $items[params[0][0]];

    $lastSelected.show();
    
    $el.on('change', function() {
      var $selected = $items[$el.find(":selected").text()];

      if ($selected) {
	$lastSelected.hide();
	$lastSelected = $selected.show();
      }
    });
  };
};
