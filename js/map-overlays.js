var MapOverlay = function(mainMap) {

  var markerArray = [];

  function addMarker(position) {
    if (markerArray.length > 0)
      deleteMarkers();

    var customMarkerImage = '../images/markers/user_location_marker.svg';
    var marker = new google.maps.Marker({
      position: position,
      map: mainMap,
      icon: customMarkerImage
    });

    markerArray.push(marker);
  }

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
      markerArray.push(marker);
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