"use strict";

App.form = new function() {
  var inputs = {};
  var models = {};
  var nextId = App.fn.sequence();

  this.bind = function(modelsToBind) {
    if (_.isEmpty(models)) {
      models = modelsToBind;
    } else {
      console.error("form models already bound");
    }

    App.page.pushDestructor(function() {
      inputs = {};
      models = {};
      nextId = App.fn.sequence();
    });
  };

  this.input = function(key) {
    var [modelKey, modelProp] = key.split(".");
    var model = models[modelKey];
    if (!model) {
      throw "model with key `" + modelKey + "` not found";
    }
    
    var id = "form-input-" + nextId();
    var text = model.textOf(modelProp);
    
    inputs[key] = {
      "id": id,
      "name": modelProp,
      "model": model
    };
    
    switch (model.typeOf(modelProp)) {
    case "text":
      return "<label>"+text+'<input id="'+id+'" type="text"></label>';
    case "number":
      return "<label>"+text+'<input id="'+id+'" type="number"></label>';
      
    default:
      throw "unresolved type for prop `" + modelProp + "`";
    }
  };
  
  this.submit = function() {
    var data = {};

    _.each(inputs, function(input, key) {
      var value = $("#" + input.id).val();
      input.model.set(input.name, value);
    });
    
    _.each(models, function(model, key) {
      model.validate();
      if (0 ==  model.validationErrors.length) {
        data[key + ":" + model.constructor.name] = model.getHqueryData();
      }
    });

    console.log(data);
  };
};
