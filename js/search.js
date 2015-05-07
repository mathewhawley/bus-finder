var Search = function(map) {

  var autocomplete = null,
      modal = null;

  // Loader that will display while performing AJAX requests
  var loader = document.createElement('div');
  loader.setAttribute('id', 'js-loader');
  loader.innerHTML +=
    '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">' +
      '<path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">' +
        '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>' +
      '</path>' +
    '</svg>';

  // Select element that will display bus stop information
  var resultsContainer = document.getElementById('js-results-list');

  // Adds listeners to 'Find stops near me' and search field elements
  function init() {
    var btn = document.getElementById('js-nearest-stops');
    btn.addEventListener('click', checkForGeolocation);
    var searchField = document.getElementById('js-search');
    autocomplete = new google.maps.places.Autocomplete(searchField);
    google.maps.event.addListener(autocomplete, 'place_changed', repositionMap);
    modal = new Modal();
  }

  // Place search
  function repositionMap() {
    addLoader();
    var newLat = autocomplete.getPlace().geometry.location.lat(),
        newLng = autocomplete.getPlace().geometry.location.lng(),
        newPos = new google.maps.LatLng(newLat, newLng);
    map.setNewLocation(newPos);
    map.addMarker(newPos);
    getNearestStops();
  }

  // Geolocation search
  function checkForGeolocation() {
    ('geolocation' in navigator) ? getLocation() : alert('Sorry, geolocation is not available. Please check your location settings.');
  }

  // Get the current location
  function getLocation() {
    addLoader();
    navigator.geolocation.getCurrentPosition(success, fail, { timeout: 10000 });
  }

  // Geolocation success
  function success(position) {    
    var lat = position.coords.latitude,
        lng = position.coords.longitude,
        newPos = new google.maps.LatLng(lat, lng);
    map.setNewLocation(newPos);
    map.addMarker(newPos);
    getNearestStops();
  }

  // Geolocation fail
  function fail() {
    alert('Unable to find current location, please try again');
  }

  // Get stops nearest to selected position
  function getNearestStops() {
    var newBounds = map.getNewBounds();
    var url = 'http://digitaslbi-id-test.herokuapp.com/bus-stops?northEast=' + newBounds[0] + ',' + newBounds[1] + '&southWest=' + newBounds[2] + ',' + newBounds[3];
    $.ajax({ type: 'GET', url: url, dataType: 'jsonp' })
    .done(function(response) {
      map.addNearestMarkers(response.markers);
      addResultsToDashboard(response.markers);
    });
  }

  // Add nearest bus stop information to dashboard
  function addResultsToDashboard(list) {
    resultsContainer.innerHTML = '';
    list.forEach(function(el) {
      var itemWrapper = document.createElement('div');
      itemWrapper.setAttribute('class', 'bus-stop-item');
      var stopIndicator = (el.stopIndicator === null) ? '' : el.stopIndicator;
      var towards = (el.towards === null) ? 'n/a' : el.towards;
      itemWrapper.innerHTML +=
      '<div class="bus-stop-item-contents">' +
        '<div class="list-col-left">' +
          '<p class="stop-indicator">' + stopIndicator + '</p>' +
        '</div>' +
        '<div class="list-col-right">' +
          '<p class="stop-name">' + el.name + '</p>' +
          '<p class="stop-towards">Towards ' + towards + '</p>' +
          '<div class="stop-routes"></div>' +
        '</div>' + 
      '</div>';
      // Loop over routes and add to each new itemWrapper element
      el.routes.forEach(function(route) {
        var stopRoutes = itemWrapper.firstChild.lastChild.lastChild;
        stopRoutes.innerHTML += '<p class="stop-route-item">' + route.name + '</p>'
      });
      // Create modal for each listed bus stop
      modal.attachModal(null, el, itemWrapper);
      // Append each complete result to the view
      resultsContainer.appendChild(itemWrapper);
    });
  }

  // What it says on the tin
  function addLoader() {
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(loader);
  }

  return {
    init: init
  };

};