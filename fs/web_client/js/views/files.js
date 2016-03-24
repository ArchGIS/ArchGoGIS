'use strict';

App.views.files = new (App.View.extend({
  'show': function() {
    var form = new FormData();
    var $files = [$("#file1"), $("#file2")];
    var $submit = $('#submit');

    var query = {
      'r:Research': {
        'description/text': 'testing file api',
        'year/number': '2017',
        'test/number': '1'
      }
    };

    /*
    $.post({
      'url': '/hquery/upsert',
      'data': JSON.stringify(query)
    });*/
    
    $submit.on('click', function() {
      // Обычные данные.
      _.each(query, function(object, tag) {
        form.append(tag, JSON.stringify(object));
      });

      // Добавляем файлы в форму.
      _.each(_.map($files, $file => $file.prop("files")), function(file, index) {
        if (file.length) {
          var identifier = "f"+index;
          var tag = identifier + ":File";
          
          form.append(tag, file[0]);
          form.append("r_Has_" + identifier, '{}');
        }
      });

      console.log(form);

      $.ajax({
        "processData": false,
        "contentType": false,
        "data": form,
        "type": "POST",
        "url": "/hquery/upsert",
        "success": console.log
      });
    });
  }
}));

/*

1) распаковать данные из formData
2) сохранить файлы
2.1) если файлы не сохранены, прерывать работу, возвращать ошибку
3) создавать сущности
4) связать файлы с сущностями

*/
