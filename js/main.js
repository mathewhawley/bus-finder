$(document).ready(function() {

  var App = function() {

    var map = null;

    function init() {
      document.getElementById('js-reset-map').addEventListener('click', reset);
      createMainMap();
      enableSearch();
    }

    function createMainMap() {
      map = new Map();
      map.mainInit();
    }

    function enableSearch() {
      var search = new Search(map);
      search.init();
    }

    function reset() {
      document.location.reload();
    }

    return {
      init: init
    };

  };

  var busFinder = new App();
  busFinder.init();

});