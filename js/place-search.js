var PlaceSearch = function(map) {

  var autocomplete = null;

  function init() {
    var searchField = document.getElementById('js-search');
    autocomplete = new google.maps.places.Autocomplete(searchField);
    google.maps.event.addListener(autocomplete, 'place_changed', repositionMap);
  }

  function repositionMap() {
    var newLat = autocomplete.getPlace().geometry.location.j,
        newLng = autocomplete.getPlace().geometry.location.C;
    newPos = new google.maps.LatLng(newLat, newLng);
    map.setNewLocation(newPos);
    map.addMarker(newPos);
  }

  return {
    init: init
  };

};