"use strict";

App.models.proto = function(key, scheme, props) {
  var t = App.locale.translate;

  this.key = key;
  this.validationErrors = [];
  this.relations = [];
  
  this.typeOf = (propName) => scheme[propName].type;
  this.textOf = (propName) => t(scheme[propName].key);

  this.set = (propName, value) => {
    if (scheme[propName]) {
      props[propName] = value;
    } else {
      throw "`" + propName + "` property is missing in the scheme";
    }
  };
  
  this.get = (propName, value) => props[propName];

  this.getHqueryData = () => {
    var data = {};
    for (var key in props) {
      data[key + "/" + scheme[key].type] = props[key];
    }
    return data;
  };
  
  this.validate = () => {
    _.each(scheme, (info, name) => {
      if (info.validations) {
        _.each(info.validations, (validator) => {
          if (!validator(props[name])) {
            this.validationErrors.push(
              {"prop": name, "error": validator.name}
            );
          }
        });
      }
    });
  };
};

App.models.proto.parseScheme = function(modelName, scheme) {
  return _.mapObject(scheme, (propInfo, propName) => _.extend(propInfo, {
    "key": modelName + ".prop." + propName
  }));
};
