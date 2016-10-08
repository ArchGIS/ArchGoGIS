'use strict';

App.widgets.Table = function(params, id) {
  var head = {'id': id + '-head', '$el': null};
  var body = {'id': id + '-body', '$el': null};
  
  var rootTmpl = _.template(`
    <table class="pure-table pure-table-horizontal">
      <thead id="<%= headId %>">
      </thead>
      <tbody id="<%= bodyId %>">
      </tbody>
    </table>
  `);

  var thTmpl = _.template(`
    <tr>
      <% _.each(columns, function(column) { %>
        <th><%= column %></th>
      <% }); %>
    </tr>
  `);

  var tdTmpl = _.template(`
    <tr>
      <% _.each(columns, function(column) { %>
        <td><%= column %></td>
      <% }); %>
    </tr>
  `);
  
  this.early = function() {
    return rootTmpl({'headId': head.id, 'bodyId': body.id});
  };

  this.later = function() {
    head.$el = $('#' + head.id);
    body.$el = $('#' + body.id);
  };

  this.setHead = function(headingColumns) {
    head.$el.html(thTmpl({'columns': headingColumns}));
    return this;
  };

  this.setBody = function(rows) {
    body.$el.append("<tr>" + _.map(rows, row => tdTmpl({'columns': row})) + "</tr>");
    return this;
  };

  this.appendRow = function(rowData, numColumns) {
    body.$el.append("<tr>" + tdTmpl({'columns': rowData, 'colspan': numColumns}) + "</tr>");
  };
};
