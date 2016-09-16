"use strict";

(function() {
  // Возможно когда-нибудь вместо alert будут использоваться
  // более культурные модальные (или не модальные) окна.
  
  // #FIXME: тут тоже нужно использовать locale
  
  function displayError(message) {
    alert(`Ошибка: ${message}`);
  }

  function askConfirmation(message) {
    return confirm(message);
  }

  App.alert = {
    "error": displayError,
    "confirm": askConfirmation
  };
}());
