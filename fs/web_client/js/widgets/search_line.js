'use strict';

App.widgets.SearchLine = function(params, id) {
  var grepObject = App.fn.grepObject;
  
  var $input = null;
  var records = {};
  var tmpl = _.template(`<input id="<%= id %>" class="form-control autoinput"></input>`);
  
  params = $.extend({
    'searchOnFocus': true
  }, params);
  
  this.early = function() {
    return tmpl({'id': id});
  };

  this.later = function() {
    $input = $('#' + id);

    var minLength = params.minLength || 3;
    var lastTerm = '';
    var items = [];
 
    $input.autocomplete({
      'minLength': params.minLength || 3,
      'source': function(request, response) {
        var term = request.term.toLowerCase();

      	if (term != lastTerm) {
      	  lastTerm = term;
      	  // Нужно забирать данные заново.
      	  params.source(term).then(
            function(result) {
              records = result;
              if (typeof params.etl == 'function') {
		            result = params.etl(result);
              }
              items = _.uniq(result, 'label');
              response(items);
            }
          );
        } else {
          response(grepObject('^' + term, items, 'label'));
        }
      }
    });

    if (params.searchOnFocus) {
      $input.on('focus', function() { $input.autocomplete("search"); });
    }
  };

  this.on = (event, callback) => $input.on(event, callback);
  
  this.getRecords = () => records;
};
