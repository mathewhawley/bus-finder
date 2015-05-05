$(document).ready(function() {

  var map = null;

  var App = function() {

    function init() {
      loadMainMap();
    }

    function loadMainMap() {
      map = new Map();
      google.maps.event.addDomListener(window, 'load', map.mainInit());
    }

    return {
      init: init
    };
  };

  var busFinder = new App();
  busFinder.init();

});