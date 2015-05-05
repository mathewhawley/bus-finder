$(document).ready(function() {

  var mainMap = null;

  var App = function() {

    function init() {
      createMainMap();
      enableGeoSearch();
    }

    function createMainMap() {
      var map = new Map();
      mainMap = map.mainInit();
    }

    function enableGeoSearch() {
      var geoSearch = new GeoSearch();
      geoSearch.init();
    }

    return {
      init: init
    };

  };

  var busFinder = new App();
  busFinder.init();

});