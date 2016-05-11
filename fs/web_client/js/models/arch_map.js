"use strict";

(function() {
  function ArchMap(key) {
    App.models.base.call(this, key, ArchMap.scheme);

    var resolveByAuthorAndYear = (term, resolve) => {
      var year = null;
      var maybeMatch = term.match(/\(?(\d+)\)?/);
      if (maybeMatch) {
        year = maybeMatch[1];
      }

      
    };

    var resolveByIsbn = (term, resolve) => resolve({});
    var resolveByUdc = (term, resolve) => resolve({});
    
    var resolveTerm = (term, resolve) => {
      if (/^\w{4,}/.test(term)) {
        resolveByAuthorAndYear(term, resolve);
      } else if (term.contains("-")) {
        resolveByIsbn(term, resolve);
      } else {
        resolveByUdc(term, resolve);
      }
    };
    
    this.finder = (term) => {
      return (new Promise((resolve, reject) => {
        var url = `/search/arch_maps?term=${term}`;
        $.get(url).success(resp => resolve($.parseJSON(resp))).error(reject);
      })).then(result => {
        return new Promise((resolve, reject) => {
          resolve(_.map(result, (am) => {
            return {
              "id": am.id,
              "label": am.name
            };
          }));
        });
      });
    };
  }

  ArchMap.scheme = {
    "Organization.vendorCode": {"type": "number"},
    "Organization.storeSince": {"type": "number"}
  };

  App.models.ArchMap = ArchMap;
}());
