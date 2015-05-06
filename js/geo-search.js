var GeoSearch = function(map) {

  var resultsContainer = document.getElementById('js-results-list');

  function init() {
    var btn = document.getElementById('js-nearest-stops');
    btn.addEventListener('click', checkForGeolocation);
  }

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
        newCoords = new google.maps.LatLng(lat, lng);
    map.setCurrentPosition(newCoords);
  }

  function fail() {
    alert('Unable to find current location, please try again');
  }

  return {
    init: init
  };
};