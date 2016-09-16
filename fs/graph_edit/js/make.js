"use strict";

(function() {
  function makeButton(text, cssClass, onclick) {
    return $("<button/>", {
      "text": text,
      "class": cssClass
    }).on("click", onclick);
  }

  function makeRedButton(text, onclick) {
    return makeButton(text, "pure-button button-error", onclick);
  }

  function makeGrayButton(text, onclick) {
    return makeButton(text, "pure-button", onclick);
  }

  function makeBlueButton(text, onclick) {
    return makeButton(text, "pure-button pure-button-primary", onclick);
  }

  function makeOrangeButton(text, onclick) {
    return makeButton(text, "pure-button button-warning", onclick);
  }

  function makeGreenButton(text, onclick) {
    return makeButton(text, "pure-button pure-success", onclick);
  }

  App.make = {
    "redButton": makeRedButton,
    "grayButton": makeGrayButton,
    "blueButton": makeBlueButton,
    "orangeButton": makeOrangeButton,
    "greenButton": makeGreenButton
  };
}());
