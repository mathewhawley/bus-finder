var Map = function() {

  var mainMap = null,
      mapOverlay = null;

  // Creates main map and overlay instance (that will handle markers and info windows)
  function mainInit() {
    createMainMap();
    mapOverlay = new MapOverlay(mainMap);
  }

  function createMainMap() {
    var mapDiv = document.getElementById('js-map-canvas');
    var mapOptions = {
      center: new google.maps.LatLng(51.508800, -0.127477),
      zoom: 12,
      scrollwheel: false,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT
      },
      streetViewControl: false,
      panControl: false,
      mapTypeControl: false
    };
    mainMap = new google.maps.Map(mapDiv, mapOptions);
  }

  function addMarker(position) {
    mapOverlay.addMarker(position);
  }

  function addNearestMarkers(markers) {
    mapOverlay.addNearestMarkers(markers);
  }

  function setNewLocation(position) {
    mainMap.setOptions({
      center: position,
      zoom: 17
    });
  }

  function getNewBounds() {
    var swLat = mainMap.getBounds().Ga.C,
        swLng = mainMap.getBounds().xa.j,
        neLat = mainMap.getBounds().Ga.j,
        neLng = mainMap.getBounds().xa.C;
    return [swLat, swLng, neLat, neLng];
  }

  return {
    mainInit: mainInit,
    addMarker: addMarker,
    addNearestMarkers: addNearestMarkers,
    setNewLocation: setNewLocation,
    getNewBounds: getNewBounds
  };

};