'use strict';

App.models.File = function() {};

App.models.File.findDocForHeritage = function(docType, docNum, docDate) {
	var d = $.Deferred();

	let query = JSON.stringify({
		"h:Heritage": {"id": "*"},
    "doc:File": {"id": "*", "select": "*", 
    	"filter": `docType=${docType}=text;docNum=${docNum}=text;docDate=${docDate}=text`},
    "h__has__doc": {},
  })

	$.post({
	  url: "/hquery/read",
	  data: query,
	  beforeSend: function(xhr) {
	    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
	  },
	  success: function(response) {
	    response = JSON.parse(response);

	    response = _.uniq(response.doc, function(item, key) { 
			  return item.id;
			});

	  	d.resolve(response);
	  }
	});

	return d.promise();
}

App.models.File.url = function(id) {
  return id ? `${HOST_URL}/local_storage/${id}` : '#e404';
};

App.models.File.href = function(id, text) {
  return '<a target="_blank" href="' + App.models.File.url(id) + '">' + text + '</a>';
};
