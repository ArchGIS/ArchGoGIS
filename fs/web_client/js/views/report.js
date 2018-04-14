'use strict';

App.views.report = new (Backbone.View.extend({
  "show": function(arg, arg2) {
    let repId = App.url.get('id');

    $(".view-icon").on('click', function() {
      let fileid = $(this).attr('fileid');
      $("#report-view-file").attr('src', (App.models.File.url(fileid)));
    }, this)

    let filesId = $.map($(".view-icon"), function(obj) {
      return $(obj).attr("fileid");
    });

    $("#upload-file").on("click", function(e) {
      const file = $('#pub-file-input')[0];

      if (file.files[0]) {
        uploadFile(file.files[0]).then(function(key) {
          filesId.push(key)
          let tmp = {};
          tmp[`el:Report`] = {};
          tmp[`el:Report`]["id"] = `${repId}`;
          tmp[`el:Report`]["fileid/text"] = `${filesId}`;
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
  },
}))