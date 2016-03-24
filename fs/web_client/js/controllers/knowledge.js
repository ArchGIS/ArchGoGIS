'use strict';

App.controllers.knowledge = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get('id');
    
    var query = {
      "k:Knowledge": {"id": id, "select": "*"},
      "m:Monument": {"id": "*", "select": "*"},
      "ty:MonumentType": {"id": "*", "select": "*"},
      "r:Research": {"id": "*", "select": "*"},
      "a:Author": {"id": "*", "select": "*"},
      "c:Culture": {"id": "*", "select": "*"},
      "ty:MonumentType": {"id": "*", "select": "*"},
      "e:Epoch": {"id": "*", "select": "*"},
      "k_Describes_m": {},
      "r_Contains_k": {},
      "k_CultureOf_c": {},
      "a_Created_r": {},
      "m_TypeOf_ty": {},
      "m_EpochOf_e": {}
    };

    $.post('/hquery/read', JSON.stringify(query))
    .success(function(monumentData) {
      var query = {
        "k:Knowledge": {"id": id, "select": "*"},
        "tp:File": {"id": "*", "select": "*"},
        "photos:File": {"id": "*", "select": "*"},
        "tp_TopPlanOf_k": {},
        "photos_PhotoFrom_k": {}
      };
      monumentData = JSON.parse(monumentData);
      
      $.post('/hquery/read', JSON.stringify(query))
      .success(function(photoData) {
        var noPhotos = {"tp": null, "photos": []};
        photoData = $.extend(noPhotos, JSON.parse(photoData));
        App.page.render('knowledge', $.extend(photoData, monumentData));
      });    
    });
  }
}));
