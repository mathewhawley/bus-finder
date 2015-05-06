$(document).ready(function() {

  // AJAX request function
  function request(type, url) {
    return $.ajax({
      type: type,
      url: url,
      dataType: 'jsonp'
    });
  }

  // Select element that will display bus stop information
  var resultsContainer = document.getElementById('js-results-list');
  // Initiate array that will hold map markers
  var markerArray = [];
  // Loader that will display while performing AJAX requests
  var loader = document.createElement('div');
  loader.setAttribute('id', 'js-loader');
  loader.innerHTML +=
    '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">' +
      '<path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">' +
        '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>' +
      '</path>' +
    '</svg>';

  

  /* Initialize map
     ========================================================================== */

  // function initialize() {
  //   var mapDiv = document.getElementById('js-map-canvas');
  //   var london = new google.maps.LatLng(51.508800, -0.127477);
  //   var mapOptions = {
  //     center: london,
  //     zoom: 12,
  //     scrollwheel: false,
  //     zoomControlOptions: {
  //       style: google.maps.ZoomControlStyle.LARGE,
  //       position: google.maps.ControlPosition.RIGHT
  //     },
  //     streetViewControl: false,
  //     panControl: false,
  //     mapTypeControl: false
  //   };
  //   map = new google.maps.Map(mapDiv, mapOptions);
  // }

  // google.maps.event.addDomListener(window, 'load', initialize);


  /* Set map to current location
     ========================================================================== */

  // document.getElementById('js-nearest-stops').addEventListener('click', function() {

  //   // Clear results container of any old list items
  //   resultsContainer.innerHTML = '';
  //   // Show loader
  //   resultsContainer.appendChild(loader);

  //   // Clear any markers that are on the map
  //   if (markerArray.length > 0)
  //     deleteMarkers();

  //   // Check to see if geolocation object exists
  //   if ('geolocation' in navigator)
  //     navigator.geolocation.getCurrentPosition(success, fail, {timeout: 10000});
  //   else
  //     alert('Sorry, geolocation is not available. Please check your location settings.');

  // });



  /* Reset map to initial view
     ========================================================================== */

  document.getElementById('js-reset-map').addEventListener('click', function() {
    document.location.reload();
  });



  /* Search by place
     ========================================================================== */

  var searchField = document.getElementById('js-search');
  var autocomplete = new google.maps.places.Autocomplete(searchField);
  
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    // Clear results list
    resultsContainer.innerHTML = '';
    // Show loader
    resultsContainer.appendChild(loader);
    // Create new LatLng position
    var currentLat = autocomplete.getPlace().geometry.location.A,
        currentLng = autocomplete.getPlace().geometry.location.F,
        newPosition = new google.maps.LatLng(currentLat, currentLng);

    // Clear any markers that are on the map
    if (markerArray.length > 0)
      deleteMarkers();

    // Re-position map to new location and get relevant bus stops
    setNewPosition(newPosition);
    getBusStops();
  });



  /* Geolocation success and fail functions
     ========================================================================== */

  // On geolocation success, create new google maps position variable
  // function success(position) {
  //   var currentLat = position.coords.latitude,
  //       currentLng = position.coords.longitude,
  //       newPosition = new google.maps.LatLng(currentLat, currentLng);

  //   setNewPosition(newPosition);
  //   getBusStops();
  // }

  // // On geolocation fail, alert user
  // function fail() {
  //   loader.style.display = 'none';
  //   alert('Unable to find current location, please try again');
  // }



  /* Map re-positioning functions
     ========================================================================== */

  // Set the new map position
  function setNewPosition(position) {
    map.setOptions({
      center: position,
      zoom: 17
    });
    addMarker(position);
  }

  // Add custom marker for current location
  // function addMarker(position) {
  //   var customMarkerImage = '../images/markers/user_location_marker.svg';
  //   var marker = new google.maps.Marker({
  //     position: position,
  //     map: map,
  //     icon: customMarkerImage,
  //     title: 'You are here'
  //   });
  //   markerArray.push(marker);
  // }

  // Get bus stops within map bounds,
  function getBusStops() {
    var swLat = map.getBounds().Ea.A,
        swLng = map.getBounds().wa.j,
        neLat = map.getBounds().Ea.j,
        neLng = map.getBounds().wa.A,
        url = 'http://digitaslbi-id-test.herokuapp.com/bus-stops?northEast=' + neLat + ',' + neLng + '&southWest=' + swLat + ',' + swLng;

    // Request bus stops via API
    request('GET', url).done(function(response) {
      // Remove loader
      resultsContainer.innerHTML = '';
      addNearestMarkers(response);
      addResultsToDashboard(response.markers);
    });
  }

  // Create and add markers to map
  function addNearestMarkers(response) {
    response.markers.forEach(function(item) {
      var position = new google.maps.LatLng(item.lat, item.lng);
      var customMarkerImage = '../images/markers/bus_stop_marker.svg';
      var marker = new MarkerWithLabel({
        position: position,
        map: map,
        icon: customMarkerImage,
        labelContent: item.stopIndicator,
        labelAnchor: new google.maps.Point(10, 34),
        labelClass: 'marker-label',
        labelInBackground: false
      });

      // Attach listeners and modals to each marker
      createModalForMarkers(item, marker);
      // Add info window to each marker
      addInfoWindow(marker, item);
      markerArray.push(marker);
    });
  }

  // List results on the dashboard
  function addResultsToDashboard(list) {
    list.forEach(function(item) {
      var itemWrapper = document.createElement('div');
      itemWrapper.setAttribute('class', 'bus-stop-item');

      if (item.stopIndicator === null)
        var stopIndicator = '';
      else
        var stopIndicator = item.stopIndicator;

      if (item.towards === null)
        var towards = 'n/a';
      else
        var towards = item.towards;

      itemWrapper.innerHTML +=
      '<div class="bus-stop-item-contents">' +
        '<div class="list-col-left">' +
          '<p class="stop-indicator">' + stopIndicator + '</p>' +
        '</div>' +
        '<div class="list-col-right">' +
          '<p class="stop-name">' + item.name + '</p>' +
          '<p class="stop-towards">Towards ' + towards + '</p>' +
          '<div class="stop-routes"></div>' +
        '</div>' + 
      '</div>';

      // Loop over routes and add to each new itemWrapper element
      item.routes.forEach(function(route) {
        var stopRoutes = itemWrapper.firstChild.lastChild.lastChild;
        stopRoutes.innerHTML += '<p class="stop-route-item">' + route.name + '</p>'
      });
      // Create modal for each listed bus stop
      createModal(item, itemWrapper);
      // Append each complete result to the view
      resultsContainer.appendChild(itemWrapper);
    });
  }



  /* Info window and marker events
   ========================================================================== */

  function addInfoWindow(marker, item) {
    var infoWindowContent = '<p class="iw-title">' + item.name + '</p>';

    item.routes.forEach(function(route) {
      infoWindowContent += '<p class="iw-route-item">' + route.name + '</p>'
    });

    var infowindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    customiseInfoWindow(infowindow);

    google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.open(map, marker);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close(map, marker);
    });
  }

  function customiseInfoWindow(element) {
    google.maps.event.addListener(element, 'domready', function() {
      var iwOuter = $('.gm-style-iw');
      var iwBackground = iwOuter.prev();
      // Removes close button
      iwOuter.next().css({'display' : 'none'});
      // Removes arrow and background arrow
      iwBackground.children(':nth-child(1)').css({'display' : 'none'});
      iwBackground.children(':nth-child(3)').css({'display' : 'none'});
      // Remove the background shadow DIV
      iwBackground.children(':nth-child(2)').css({'display' : 'none'});
      // Remove the white background DIV
      iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    });
  }



  /* Delete all markers
     ========================================================================== */

  function clearMarkers() {
    var markerCount = markerArray.length;
    for (var i = 0; i < markerCount; i++) {
      markerArray[i].setMap(null);
    }
  }

  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }



  /* Modal
     ========================================================================== */

  var modal = document.getElementById('js-modal-overlay');
  var modalCloseBtn = document.getElementById('js-modal-close-btn');
  modalCloseBtn.addEventListener('click', modalWindow);
  var modalRouteInfo = document.getElementById('js-modal-route-info');

  // Function turns modal on/off
  function modalWindow() {
    modal.style.visibility = (modal.style.visibility === 'visible') ? 'hidden' : 'visible';
  }

  function createModal(stopObject, element) {
    // Add click event listener to each listed bus stop
    element.addEventListener('click', function() {
      // Open modal window
      modalWindow();
      // Clear modal route info panel
      modalRouteInfo.innerHTML = '';
      // Create map for modal
      createModalMap(stopObject);
      // Create URL for AJAX request
      var url = 'http://digitaslbi-id-test.herokuapp.com/bus-stops/' + stopObject.id;
      // Make request for selected stop departure times
      request('GET', url).done(function(response) {
        appendDepartures(response.arrivals, stopObject);
      });
    });
  }

  function createModalForMarkers(stopObject, element) {
    // Add click event listener to each marker
    google.maps.event.addListener(element, 'click', function() {
      // Open modal window
      modalWindow();
      // Clear modal route info panel
      modalRouteInfo.innerHTML = '';
      // Create map for modal
      createModalMap(stopObject);
      // Create URL for AJAX request
      var url = 'http://digitaslbi-id-test.herokuapp.com/bus-stops/' + stopObject.id;
      // Make request for selected stop departure times
      request('GET', url).done(function(response) {
        appendDepartures(response.arrivals, stopObject);
      });
    });
  }

  // Create a new map for the modal
  function createModalMap(stopObject) {
    var mapDiv = document.getElementById('js-modal-map');
    var position = new google.maps.LatLng(stopObject.lat, stopObject.lng);
    var mapOptions = {
      center: position,
      zoom: 16,
      scrollwheel: false,
      disableDefaultUI: true
    };
    var modalMap = new google.maps.Map(mapDiv, mapOptions);
    addModalMarker(position, modalMap, stopObject);
  }

  // Add marker for stop location in modal window
  function addModalMarker(position, modalMap, stopObject) {
    var customMarkerImage = '../images/markers/bus_stop_marker.svg';
    var marker = new MarkerWithLabel({
      position: position,
      map: modalMap,
      icon: customMarkerImage,
      labelContent: stopObject.stopIndicator,
      labelAnchor: new google.maps.Point(10, 34),
      labelClass: 'marker-label',
      labelInBackground: false
    });
  }

  function appendDepartures(arrivals, stopObject) {
    // Create containing div and set class attribute
    var routeInfoDiv = document.createElement('div');
    routeInfoDiv.setAttribute('class', 'modal-route-info');

    if (stopObject.stopIndicator === null)
      var stopIndicator = '';
    else
      var stopIndicator = stopObject.stopIndicator;

    // Add header elements
    routeInfoDiv.innerHTML +=
      '<div class="modal-route-info-header">' +
        '<div class="modal-route-header-col-left">' +
          '<div class="modal-stop-indicator">' + stopIndicator + '</div>' +
        '</div>' +
        '<div class="modal-route-header-col-right">' + 
          '<p class="modal-stop-name">' + stopObject.name + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="modal-departure-info"></div>';

    // Loop over routes and add to each new routeInfoDiv element
    arrivals.forEach(function(route) {
      // If the eta for a route is 'due', don't include 'min' after the time
      if (route.estimatedWait === 'due')
        var eta = '<p class="modal-route-eta">Due</p>';
      else
        var eta = '<p class="modal-route-eta">' + route.estimatedWait.split(' ')[0] + '<span class="modal-route-eta-min">min</span></p>';

      var routes = routeInfoDiv.lastChild;
      routes.innerHTML += 
        '<div class="modal-route-item">' +
          '<div class="modal-route-col-left">' +
            '<p class="modal-route-name">' + route.routeName + '</p>' +
            '<p class="modal-route-destination">' + route.destination + '</p>' +
          '</div>' +
          '<div class="modal-route-col-right">' +
            eta +
          '</div>' +
        '</div>';
    });

    modalRouteInfo.appendChild(routeInfoDiv);
  }

});



