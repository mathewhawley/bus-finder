var Search = function(map) {

  var autocomplete = null;

  function init() {
    var btn = document.getElementById('js-nearest-stops');
    btn.addEventListener('click', checkForGeolocation);

    var searchField = document.getElementById('js-search');
    autocomplete = new google.maps.places.Autocomplete(searchField);
    google.maps.event.addListener(autocomplete, 'place_changed', repositionMap);
  }

  // Place search
  function repositionMap() {
    var newLat = autocomplete.getPlace().geometry.location.j,
        newLng = autocomplete.getPlace().geometry.location.C;
    newPos = new google.maps.LatLng(newLat, newLng);
    map.setNewLocation(newPos);
    map.addMarker(newPos);
    getNearestStops();
  }

  // Geolocation search
  function checkForGeolocation() {
    if ('geolocation' in navigator)
      getLocation();
    else
      alert('Sorry, geolocation is not available. Please check your location settings.');
  }

  function getLocation() {
    navigator.geolocation.getCurrentPosition(success, fail, { timeout: 10000 });
  }

  function success(position) {
    var lat = position.coords.latitude,
        lng = position.coords.longitude,
        newPos = new google.maps.LatLng(lat, lng);
    map.setNewLocation(newPos);
    map.addMarker(newPos);
    getNearestStops();
  }

  function fail() {
    alert('Unable to find current location, please try again');
  }

  function getNearestStops() {
    var markers = null,
        url = map.getNewBounds();

    $.ajax({ type: 'GET', url: url, dataType: 'jsonp' })
    .done(function(response) {
      map.addNearestMarkers(response.markers);
    });
  }

  return {
    init: init
  };

};