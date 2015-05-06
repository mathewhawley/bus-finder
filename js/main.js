$(document).ready(function() {

  var App = function() {

    var map = null;

    function init() {
      createMainMap();
      enableGeoSearch();
    }

    function createMainMap() {
      map = new Map();
      map.mainInit();
    }

    function enableGeoSearch() {
      var geoSearch = new GeoSearch(map);
      geoSearch.init();
    }

    return {
      init: init
    };

  };

  var busFinder = new App();
  busFinder.init();

});