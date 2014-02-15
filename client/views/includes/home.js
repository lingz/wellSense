Template.home.rendered = function() {
  if (this.find("#main-map-canvas")) {
    if (mapsLoaded) {
      createMainMap();
    } else {
      google.maps.event.addDomListener(window, 'load', createMainMap);
    }
  }
};

window.mainMarkers = null;
function createMainMap() {
  result = generateMap("main-map-canvas", function(marker) {
    Meteor.Router.to("/well/" + marker.title);
    changeMarker(marker.title, true);
  });
  if (result) mainMarkers = result.markers;
}
Deps.autorun(function() {
  var latestReport = Reports.findOne({}, {sort: {timestamp: -1}});
  if (latestReport) {
    var latestWell = Wells.findOne({shortcode: latestReport.wellCode});
    if (latestWell) {
      changeMarker(latestWell.shortcode);
    }
  }
});
