var GeoSearch = function() {

  var resultsContainer = document.getElementById('js-results-list');

  function init() {
    var btn = document.getElementById('js-nearest-stops');
    btn.addEventListener('click', checkForGeolocation);
  }

  function checkForGeolocation() {
    if ('geolocation' in navigator)
      console.log('Geolocation available');
    else
      alert('Sorry, geolocation is not available. Please check your location settings.');
  }

  return {
    init: init
  };
};