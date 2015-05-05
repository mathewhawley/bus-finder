$(document).ready(function() {

  var mainMap = null;

  var App = function() {

    function init() {
      createMainMap();
    }

    function createMainMap() {
      var map = new Map();
      mainMap = map.mainInit();
    }

    return {
      init: init
    };

  };

  var busFinder = new App();
  busFinder.init();

});