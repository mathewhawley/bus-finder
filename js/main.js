$(document).ready(function() {

  var App = function() {

    var map = null;

    // Reset map
    document.getElementById('js-reset-map').addEventListener('click', function() {
      document.location.reload();
    });

    function init() {
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

    return {
      init: init
    };

  };

  var busFinder = new App();
  busFinder.init();

});