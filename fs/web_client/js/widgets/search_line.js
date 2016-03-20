'use strict';

App.widgets.SearchLine = function(params, id) {
  var $input = null;
  var tmpl = _.template(`<input id="<%= id %>" class="autoinput"></input>`);
  params = _.extend(App.widgets.SearchLine.defaultOptions, params);
  
  this.early = function() {
    return tmpl({'id': id});
  };

  this.later = function() {
    $input = $('#' + id);
    var records = {};

    var minLength = params.minLength || 3;
    var lastTerm = '';
 
    $input.autocomplete({
      'minLength': params.minLength || 3,
      'source': function(request, response) {
	var term = request.term.toLowerCase();

	if (term.length <= minLength && term != lastTerm) {
	  lastTerm = term;
	  // Нужно забирать данные заново.
	  params.source(term).then(
            function(result) {
	      if (typeof params.etl == 'function') {
		result = params.etl(result);
	      }
	      records = result;
	      response(records);
	    }
	  );
	} else {
          // Через regexp для N записей эффективнее,
          // чем через прогон каждого record.label.toLowerCase + startsWith
	  var matcher = new RegExp('^' + term, 'i');
          response(_.filter(records, record => matcher.test(record.label)));
	}
      }
    });

    if (params.searchOnFocus) {
      $input.on('focus', function() { $input.autocomplete("search"); });
    }
  };

  this.on = function(autocompleteEvent, callback) {
    $input.on(autocompleteEvent, callback);
  };
};

App.widgets.SearchLine.defaultOptions = {
  'searchOnFocus': true
};
