'use strict';

App.views.publication = new (Backbone.View.extend({
  'show': (args) => {
    let pubId = App.url.get('id');

    let filesId = $.map($(".view-icon"), function(obj) {
      return $(obj).attr("fileid");
    });

    $("#upload-file").on("click", function(e) {
      const file = $('#pub-file-input')[0];

      if (file.files[0]) {
        uploadFile(file.files[0]).then(function(key) {
          filesId.push(key)
          let tmp = {};
          tmp[`el:Publication`] = {};
          tmp[`el:Publication`]["id"] = `${pubId}`;
          tmp[`el:Publication`]["fileid/text"] = `${filesId}`;
          let query = JSON.stringify(tmp);

          $.ajax({
            url: "/hquery/upsert",
            async: false,
            beforeSend: function(xhr) {
              xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
            },
            data: query,
            type: "POST",
            success: (response) => {
              console.log('upsert: ' + response);
              location.reload();
            }
          });
        });
      }
    })
  }
}));