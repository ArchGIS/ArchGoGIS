"use strict";

App.views.files = new (App.View.extend({
  "show": function() {
    var form = new FormData();
    var files = _.map([$("#file1"), $("#file2"), $("#file3")], $file => $file.prop("files"));
    var $submit = $("#submit");
    
    var query = {
      "r:Research": {
        "description/text": "Проверка загрузки файлов",
        "year/number": "2017",
        "test/number": "1"
      },
      "e:Epoch": {"id": "1"},
      "c:Culture": {"id": "1"},
      "ty:MonumentType": {"id": "1"},
      "m:Monument": {
        "x/number": "1",
        "y/number": "2"
      },
      "k:Knowledge": {
        "name/text": "Памятник %3ruf"
      },
      "a:Author": {"id": "50"},
      "a_Created_r": {},
      "r_Contains_k": {},
      "k_Describes_m": {},
      "k_CultureOf_c": {},
      "m_EpochOf_e": {},
      "m_TypeOf_ty": {}
    };
    
    $submit.on("click", function() {
      // Обычные данные.
      _.each(query, function(object, tag) {
        form.append(tag, JSON.stringify(object));
      });

      // Добавляем файлы в форму.
      form.append("p1:File", files[0][0]);
      form.append("p1_PhotoFrom_k", "{}");
      form.append("p2:File", files[1][0]);
      form.append("p2_PhotoFrom_k", "{}");
      form.append("tp:File", files[2][0]);
      form.append("tp_TopPlanOf_k", "{}");
      console.log(files);
      
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
