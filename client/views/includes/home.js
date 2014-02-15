Template.home.rendered = function() {
  if (this.find("#main-map-canvas")) {
    if (mapsLoaded) {
      createMainMap();
    } else {
      google.maps.event.addDomListener(window, 'load', createMainMap);
    }
  }
};

function createMainMap() {
  mainMarkers = generateMap("main-map-canvas", function(marker) {
    Meteor.Router.to("/well/" + marker.title);
  })[1];
  console.log(mainMarkers);
}
