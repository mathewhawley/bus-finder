var Modal = function() {

  var modal = document.getElementById('js-modal-overlay');
  var modalCloseBtn = document.getElementById('js-modal-close-btn');
  modalCloseBtn.addEventListener('click', toggleModal);
  var modalRouteInfo = document.getElementById('js-modal-route-info');

  function createModal(marker, el) {
    google.maps.event.addListener(marker, 'click', function() {
      toggleModal();
      modalRouteInfo.innerHTML = '';
      createModalMap(el);

      var url = 'http://digitaslbi-id-test.herokuapp.com/bus-stops/' + el.id;

      $.ajax({ type: 'GET', url: url, dataType: 'jsonp' })
      .done(function(response) {
        appendDepartures(response.arrivals, el)
      });
    });
  }

  // Create a new map for the modal
  function createModalMap(el) {
    var mapDiv = document.getElementById('js-modal-map');
    var position = new google.maps.LatLng(el.lat, el.lng);
    var mapOptions = {
      center: position,
      zoom: 16,
      scrollwheel: false,
      disableDefaultUI: true
    };
    var modalMap = new google.maps.Map(mapDiv, mapOptions);
    addModalMarker(position, modalMap, el);
  }

  // Add marker for stop location in modal window
  function addModalMarker(position, modalMap, el) {
    var customMarkerImage = '../images/markers/bus_stop_marker.svg';
    var marker = new MarkerWithLabel({
      position: position,
      map: modalMap,
      icon: customMarkerImage,
      labelContent: el.stopIndicator,
      labelAnchor: new google.maps.Point(10, 34),
      labelClass: 'marker-label',
      labelInBackground: false
    });
  }

  function appendDepartures(arrivals, el) {
    // Create containing div and set class attribute
    var routeInfoDiv = document.createElement('div');
    routeInfoDiv.setAttribute('class', 'modal-route-info');

    if (el.stopIndicator === null) {
      var stopIndicator = '';
    }
    else {
      var stopIndicator = el.stopIndicator;
    }

    // Add header elements
    routeInfoDiv.innerHTML +=
      '<div class="modal-route-info-header">' +
        '<div class="modal-route-header-col-left">' +
          '<div class="modal-stop-indicator">' + stopIndicator + '</div>' +
        '</div>' +
        '<div class="modal-route-header-col-right">' + 
          '<p class="modal-stop-name">' + el.name + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="modal-departure-info"></div>';

    // Loop over routes and add to each new routeInfoDiv element
    arrivals.forEach(function(route) {
      // If the eta for a route is 'due', don't include 'min' after the time
      if (route.estimatedWait === 'due') {
        var eta = '<p class="modal-route-eta">Due</p>';
      }
      else {
        var eta = '<p class="modal-route-eta">' + route.estimatedWait.split(' ')[0] + '<span class="modal-route-eta-min">min</span></p>';
      }

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

  function toggleModal() {
    modal.style.visibility = (modal.style.visibility === 'visible') ? 'hidden' : 'visible';
  }

  return {
    createModal: createModal
  };

};