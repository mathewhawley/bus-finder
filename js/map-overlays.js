var MapOverlay = function(mainMap) {

  var markerArray = [];
  var modal = new Modal();

  // Adds marker to specified location – either through geolocation or place search
  function addMarker(position) {
    if (markerArray.length > 0) {
      deleteMarkers();
    }
    var customMarkerImage = '../images/markers/user_location_marker.svg';
    var marker = new google.maps.Marker({
      position: position,
      map: mainMap,
      icon: customMarkerImage
    });
    markerArray.push(marker);
  }

  // Adds markers within the map bounds of specified location
  function addNearestMarkers(markers) {
    markers.forEach(function(el) {
      var position = new google.maps.LatLng(el.lat, el.lng);
      var customMarkerImage = '../images/markers/bus_stop_marker.svg';
      var marker = new MarkerWithLabel({
        position: position,
        map: mainMap,
        icon: customMarkerImage,
        labelContent: el.stopIndicator,
        labelAnchor: new google.maps.Point(10, 34),
        labelClass: 'marker-label',
        labelInBackground: false
      });
      attachInfoWindow(marker, el);
      modal.createModal(marker, el, null);
      markerArray.push(marker);
    });
  }

  // Attaches info window to a marker
  function attachInfoWindow(marker, el) {
    var infoWindowContent = '<p class="iw-title">' + el.name + '</p>';
    el.routes.forEach(function(route) {
      infoWindowContent += '<p class="iw-route-item">' + route.name + '</p>'
    });
    var infowindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    styleInfoWindow(infowindow);
    google.maps.event.addListener(marker, 'mouseover', function() { infowindow.open(mainMap, marker); });
    google.maps.event.addListener(marker, 'mouseout', function() { infowindow.close(mainMap, marker); });
  }

  // Adjusts info window styling
  function styleInfoWindow(el) {
    google.maps.event.addListener(el, 'domready', function() {
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

  function clearMarkers() {
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }
  }

  function deleteMarkers() {
    clearMarkers();
    markerArray = [];
  }

  return {
    addMarker: addMarker,
    addNearestMarkers: addNearestMarkers
  };

};