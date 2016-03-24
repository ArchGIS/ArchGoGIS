'use strict';

App.controllers.report = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get("id");

    var query = {
      "r:Report": {"id": id, "select": "*"},
      "a:Author": {"id": "*", "select": "*"},
      "k:Knowledge": {"id": "*", "select": "*"},
      "m:Monument": {"id": "*", "select": "*"},
      "a_Created_r": {},
      "r_Contains_k": {},
      "k_Describes_m": {}
    };

    $.post('/hquery/read', JSON.stringify(query))
    .success(function(reportData) {
      // var query = {
      //   "m:Monument": {"id": id},
      //   "ty:MonumentType": {"id": "?", "select": "*"},
      //   "e:Epoch": {"id": "?", "select": "*"},
      //   "m_TypeOf_ty": {},
      //   "m_EpochOf_e": {},
      // };
      // $.post('/hquery/read', JSON.stringify(query))
      // .success(function(ty) {
      //   // #FIXME: унести запрос и JSON.parse в модель    
        var respObject = JSON.parse(reportData);
      //   var type = JSON.parse(ty);
        // console.log($.extend(respObject, type));
        console.log(respObject);
        App.page.render('report/show', respObject);//$.extend(respObject, type));
      });
    // });
  }
}));