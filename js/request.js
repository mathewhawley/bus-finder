var Request = function (map) {

  function request(type, url, dataType) {
    return $.ajax({
      type: type,
      url: url,
      dataType: dataType
    });
  }

  function getNearestStops(type, url, dataType) {
    var markers = null;
    request(type, url, dataType).done(function(response) {
      markers = response;
    });
  }

  function getResults() {
    console.log(markers);
  }

  return {
    getNearestStops: getNearestStops,
    getResults: getResults
  };
}