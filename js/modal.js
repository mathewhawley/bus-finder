var Modal = function() {

  var modal = document.getElementById('js-modal-overlay');
  var modalRouteInfo = document.getElementById('js-modal-route-info');
  var modalCloseBtn = document.getElementById('js-modal-close-btn');
  modalCloseBtn.addEventListener('click', closeModal);

  function attachModal(marker, el, listElement) {
    if (marker === null) {
      dashboardModal(listElement, el);
    }
    else if (listElement === null) {
      markerModal(marker, el);
    }
  }

  // Attaches modal to each listed element on dashboard
  function dashboardModal(listElement, el) {
    listElement.addEventListener('click', function() {
      buildModal(el);
    });
  }

  // Attaches modal to each marker
  function markerModal(marker, el) {
    google.maps.event.addListener(marker, 'click', function() {
      buildModal(el);
    });
  }

  // Opens the modal, adds map, gets departure info, appends to side panel
  function buildModal(el) {
    openModal();
    modalRouteInfo.innerHTML = '';
    createModalMap(el);
    var url = 'http://digitaslbi-id-test.herokuapp.com/bus-stops/' + el.id;
    $.ajax({ type: 'GET', url: url, dataType: 'jsonp' })
    .done(function(response) {
      appendDepartures(response.arrivals, el)
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
    var stopIndicator = (el.stopIndicator === null) ? '' : el.stopIndicator;
    // Add structure and content
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
      routeInfoDiv.lastChild.innerHTML += 
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

  function openModal() {
    modal.style.visibility = 'visible';
  }

  function closeModal() {
    modal.style.visibility = 'hidden';
  }

  return {
    attachModal: attachModal
  };

};